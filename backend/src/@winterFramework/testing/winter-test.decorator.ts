import { test as bunTest, beforeAll } from 'bun:test'
import { WinterTestBuilder } from './winter-test-builder'
import { WinterContainer, autowiredMetadata } from '../container/winter-container'
import { mockBeanMetadata } from './mock-bean.decorator'
import { testMethodsRegistry } from './test.decorator'
import { WinterTestClient } from './winter-test-client'
import type { ConstructorFunction } from '../registry/controller.registry'

export interface WinterTestOptions {
    /** Controllers to register in the test context. */
    controllers?: ConstructorFunction[]
    /** Providers to register in the test context. */
    providers?: ConstructorFunction[]
}

/**
 * Class decorator that bootstraps the WinterFramework testing context.
 * It builds the application in memory, registers the requested controllers and providers, 
 * injects `@Autowired` and `@MockBean` properties, and schedules `@Test` methods 
 * to be executed by the native `bun:test` runner.
 * 
 * @param options specify the subset of controllers and providers to load for the test.
 * 
 * @example
 * ```ts
 * @WinterTest({ controllers: [UserController], providers: [UserService] })
 * export class UserControllerTest { ... }
 * ```
 */
export function WinterTest(options: WinterTestOptions) {
    return function (target: ConstructorFunction) {
        const testClassInstance = new target() as Record<string, any>

        beforeAll(() => {
            const builder = WinterTestBuilder.create()
                .addController(...(options.controllers || []))
                .addProvider(...(options.providers || []), WinterTestClient)

            const container = WinterContainer.getInstance()

            const mocks = mockBeanMetadata.get(target) || []
            for (const mockMeta of mocks) {
                const mockProxy = new Proxy({}, {
                    get(target: any, prop) {
                        return target[prop];
                    },
                    set(target: any, prop, value) {
                        target[prop] = value;
                        return true;
                    }
                })

                builder.overrideProvider(mockMeta.token, mockProxy)
                testClassInstance[mockMeta.propertyKey] = mockProxy
            }

            const app = builder.start()

            const autowiredDeps = autowiredMetadata.get(target) || []
            for (const dep of autowiredDeps) {
                testClassInstance[dep.propertyKey] = container.resolve(dep.token)
            }

            for (const dep of autowiredDeps) {
                if (dep.token === WinterTestClient) {
                    const client = testClassInstance[dep.propertyKey] as WinterTestClient
                    client.__attachApp(app)
                }
            }
        })

        const testMethods = testMethodsRegistry.get(target) || []
        for (const tm of testMethods) {
            bunTest(tm.description, async () => {
                await testClassInstance[tm.methodName]()
            })
        }
    }
}
