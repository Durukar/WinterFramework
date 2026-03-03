import type { ConstructorFunction } from '../registry/controller.registry'

export interface TestMetadata {
    methodName: string
    description: string
}

/** Registry storing @Test methods for a given Test Class */
export const testMethodsRegistry: Map<ConstructorFunction, TestMetadata[]> = new Map()

/**
 * Method decorator that marks a function to be executed as a test case 
 * when the class is booted via `@WinterTest`.
 * 
 * @param description The name/description of the test case.
 * 
 * @example
 * ```ts
 * @Test("Should return 200 OK")
 * async testSuccess() { ... }
 * ```
 */
export function Test(description: string) {
    return function (target: any, propertyKey: string) {
        const constructor = target.constructor as ConstructorFunction
        const metadata = testMethodsRegistry.get(constructor) || []
        metadata.push({ methodName: propertyKey, description })
        testMethodsRegistry.set(constructor, metadata)
    }
}
