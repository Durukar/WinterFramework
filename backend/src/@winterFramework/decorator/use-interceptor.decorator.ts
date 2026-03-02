import type { ConstructorFunction } from '../registry/controller.registry'
import {
    classInterceptors,
    methodInterceptors,
} from '../registry/interceptor.registry'

/**
 * Decorator that applies an interceptor to a controller class or method.
 * Equivalent to Spring's `HandlerInterceptor` registration.
 *
 * - Applied to a **class**: the interceptor runs before/after every method in that controller.
 * - Applied to a **method**: the interceptor runs only for that specific route handler.
 *
 * @param interceptorClass - The constructor of a class implementing {@link HandlerInterceptor}.
 * @returns A class or method decorator function.
 *
 * @example
 * ```ts
 * // Class-level — applies to all routes
 * @UseInterceptor(AuthInterceptor)
 * @RestController('/admin')
 * export class AdminController { ... }
 *
 * // Method-level — applies to a single route
 * @GetMapping('/metrics')
 * @UseInterceptor(LoggingInterceptor)
 * getMetrics(c: Context) { ... }
 * ```
 */
export function UseInterceptor(interceptorClass: ConstructorFunction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (
        target: any,
        propertyKey?: string,
        descriptor?: PropertyDescriptor,
    ): any {
        if (propertyKey && descriptor) {
            // Method-level interceptor
            const controllerClass = (target as object).constructor as ConstructorFunction

            if (!methodInterceptors.has(controllerClass)) {
                methodInterceptors.set(controllerClass, new Map())
            }

            const methodMap = methodInterceptors.get(controllerClass)!
            if (!methodMap.has(propertyKey)) {
                methodMap.set(propertyKey, [])
            }

            methodMap.get(propertyKey)!.push(interceptorClass)
            return descriptor
        }

        // Class-level interceptor
        const controllerClass = target as ConstructorFunction

        if (!classInterceptors.has(controllerClass)) {
            classInterceptors.set(controllerClass, [])
        }

        classInterceptors.get(controllerClass)!.push(interceptorClass)
        return target
    }
}
