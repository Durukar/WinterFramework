import type { ConstructorFunction } from '../registry/controller.registry'
import type { HandlerInterceptor } from '../interceptor/handler-interceptor'

/**
 * Map of controller class → class-level interceptors.
 * Populated by `@UseInterceptor` applied at the class level.
 */
export const classInterceptors: Map<ConstructorFunction, ConstructorFunction[]> = new Map()

/**
 * Map of controller class → method name → method-level interceptors.
 * Populated by `@UseInterceptor` applied at the method level.
 */
export const methodInterceptors: Map<ConstructorFunction, Map<string, ConstructorFunction[]>> = new Map()

/**
 * Global interceptors registered via `Winter.addInterceptor()`.
 */
export const globalInterceptors: ConstructorFunction[] = []

/**
 * Resolves all interceptor instances for a given controller method,
 * in order: global → class-level → method-level.
 *
 * @param controllerClass - The controller constructor.
 * @param methodName - The handler method name.
 * @returns An ordered array of `HandlerInterceptor` instances.
 */
export function resolveInterceptors(
    controllerClass: ConstructorFunction,
    methodName: string,
): HandlerInterceptor[] {
    const interceptors: HandlerInterceptor[] = []

    // Global interceptors
    for (const interceptorClass of globalInterceptors) {
        interceptors.push(new interceptorClass() as HandlerInterceptor)
    }

    // Class-level interceptors
    const classLevel = classInterceptors.get(controllerClass)
    if (classLevel) {
        for (const interceptorClass of classLevel) {
            interceptors.push(new interceptorClass() as HandlerInterceptor)
        }
    }

    // Method-level interceptors
    const methodLevel = methodInterceptors.get(controllerClass)
    if (methodLevel) {
        const methodSpecific = methodLevel.get(methodName)
        if (methodSpecific) {
            for (const interceptorClass of methodSpecific) {
                interceptors.push(new interceptorClass() as HandlerInterceptor)
            }
        }
    }

    return interceptors
}
