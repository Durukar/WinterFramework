import type { Context } from 'hono'

/**
 * Interface for handler interceptors in Winter Framework.
 * Equivalent to Spring's `HandlerInterceptor`.
 *
 * Interceptors can execute logic before and after controller methods.
 * If `preHandle` returns `false`, the request is short-circuited and
 * the controller method is not invoked.
 *
 * @example
 * ```ts
 * @Injectable()
 * export class LoggingInterceptor implements HandlerInterceptor {
 *   preHandle(ctx: Context): boolean {
 *     console.log(`→ ${ctx.req.method} ${ctx.req.url}`);
 *     return true;
 *   }
 *
 *   postHandle(ctx: Context): void {
 *     console.log(`← Response sent`);
 *   }
 * }
 * ```
 */
export interface HandlerInterceptor {
    /**
     * Called before the controller method executes.
     * @param ctx - The Hono request context.
     * @returns `true` to proceed, `false` to short-circuit the request.
     */
    preHandle(ctx: Context): boolean | Promise<boolean>

    /**
     * Called after the controller method executes successfully.
     * @param ctx - The Hono request context.
     * @param result - The response returned by the controller method.
     */
    postHandle?(ctx: Context, result?: Response): void | Promise<void>
}
