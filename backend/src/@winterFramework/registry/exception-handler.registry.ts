import type { ConstructorFunction } from '../registry/controller.registry'
import type { Context } from 'hono'

/**
 * Describes a single exception handler method within a `@ControllerAdvice` class.
 */
export interface ExceptionHandlerEntry {
    /** The exception class this handler catches. */
    exceptionType: ConstructorFunction
    /** The method name on the advice class. */
    handler: string
}

/**
 * Describes a registered `@ControllerAdvice` class and its exception handlers.
 */
export interface ControllerAdviceEntry {
    /** The advice class constructor. */
    constructor: ConstructorFunction
    /** The instance of the advice class (created on first use). */
    instance?: object
    /** Registered exception handler methods. */
    handlers: ExceptionHandlerEntry[]
}

/** Global list of registered `@ControllerAdvice` classes. */
export const controllerAdviceList: ControllerAdviceEntry[] = []

/** Map of advice constructor → its registered exception handlers (populated by decorators). */
export const exceptionHandlerMap: Map<ConstructorFunction, ExceptionHandlerEntry[]> = new Map()

/**
 * Resolves the appropriate exception handler for a given error, instantiates
 * the advice class if needed, and invokes the handler.
 *
 * @param error - The thrown error.
 * @param ctx - The Hono context for crafting an HTTP response.
 * @returns The HTTP response from the handler, or a generic 500 if no handler matches.
 */
export function resolveExceptionHandler(
    error: unknown,
    ctx: Context,
): Response | Promise<Response> {
    for (const advice of controllerAdviceList) {
        for (const entry of advice.handlers) {
            if (error instanceof (entry.exceptionType as unknown as new (...args: unknown[]) => Error)) {
                // Lazily instantiate the advice class
                if (!advice.instance) {
                    advice.instance = new advice.constructor()
                }

                const instance = advice.instance as Record<string, (err: unknown, ctx: Context) => Response | Promise<Response>>
                return instance[entry.handler](error, ctx)
            }
        }
    }

    // Default fallback — no handler matched
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return ctx.json({ error: message }, 500)
}
