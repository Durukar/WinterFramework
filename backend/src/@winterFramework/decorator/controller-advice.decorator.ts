import type { ConstructorFunction } from '../registry/controller.registry'
import {
    controllerAdviceList,
    exceptionHandlerMap,
} from '../registry/exception-handler.registry'

/**
 * Class decorator that registers a class as a global exception handler.
 * Equivalent to Spring's `@ControllerAdvice`.
 *
 * Methods decorated with {@link ExceptionHandler} inside this class
 * will catch exceptions thrown by any controller method.
 *
 * @returns A class decorator function.
 *
 * @example
 * ```ts
 * @ControllerAdvice()
 * export class GlobalExceptionHandler {
 *   @ExceptionHandler(NotFoundException)
 *   handleNotFound(err: NotFoundException, c: Context) {
 *     return c.json({ error: err.message }, 404);
 *   }
 * }
 * ```
 */
export function ControllerAdvice() {
    return function <T extends ConstructorFunction>(target: T): T {
        const handlers = exceptionHandlerMap.get(target) || []
        controllerAdviceList.push({
            constructor: target,
            handlers,
        })
        return target
    }
}
