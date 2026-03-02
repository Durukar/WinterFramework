import type { ConstructorFunction } from '../registry/controller.registry'
import { exceptionHandlerMap } from '../registry/exception-handler.registry'

/**
 * Method decorator that maps a method to handle a specific exception type.
 * Must be used inside a class decorated with {@link ControllerAdvice}.
 * Equivalent to Spring's `@ExceptionHandler`.
 *
 * @param exceptionType - The exception class this method handles.
 * @returns A method decorator function.
 *
 * @example
 * ```ts
 * @ControllerAdvice()
 * export class GlobalExceptionHandler {
 *   @ExceptionHandler(BadRequestException)
 *   handleBadRequest(err: BadRequestException, c: Context) {
 *     return c.json({ error: err.message }, 400);
 *   }
 *
 *   @ExceptionHandler(HttpException)
 *   handleGeneric(err: HttpException, c: Context) {
 *     return c.json({ error: err.message }, err.status);
 *   }
 * }
 * ```
 */
export function ExceptionHandler(exceptionType: ConstructorFunction) {
    return function (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const constructor = target.constructor as ConstructorFunction

        if (!exceptionHandlerMap.has(constructor)) {
            exceptionHandlerMap.set(constructor, [])
        }

        exceptionHandlerMap.get(constructor)!.push({
            exceptionType,
            handler: propertyKey,
        })

        return descriptor
    }
}
