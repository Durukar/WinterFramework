import type { ConstructorFunction } from '../registry/controller.registry'

export interface MockBeanMetadata {
    propertyKey: string
    token: ConstructorFunction
}

/** Registry storing @MockBean annotations for a given Test Class */
export const mockBeanMetadata: Map<ConstructorFunction, MockBeanMetadata[]> = new Map()

/**
 * Property decorator that instructs the Test Container to replace the actual provider 
 * with a dynamic mock object, automatically wiring it into the test class.
 * 
 * @param token The constructor function of the dependency to be mocked.
 * 
 * @example
 * ```ts
 * @MockBean(UserService)
 * private mockUserService!: UserService;
 * ```
 */
export function MockBean(token: ConstructorFunction) {
    return function (target: any, propertyKey: string) {
        const constructor = target.constructor as ConstructorFunction
        const metadata = mockBeanMetadata.get(constructor) || []
        metadata.push({ propertyKey, token })
        mockBeanMetadata.set(constructor, metadata)
    }
}
