import type { Context } from 'hono'

/**
 * Decorator that applies a middleware function to a specific controller method or class.
 * When applied to a method, the middleware wraps the original handler and can
 * short-circuit the request (e.g. for authentication, authorization, rate limiting).
 *
 * @param middleware - An async middleware function receiving `(ctx, next)`.
 * @returns A method/class decorator function.
 *
 * @example
 * ```ts
 * @GetMapping('/secure')
 * @UseMiddleware(async (ctx, next) => {
 *   const token = ctx.req.header('Authorization');
 *   if (!token) return ctx.json({ error: 'Unauthorized' }, 401);
 *   await next();
 * })
 * secureEndpoint(c: Context) {
 *   return c.json({ message: 'Secure data' });
 * }
 * ```
 */
export function UseMiddleware(
  middleware: (ctx: Context, next: () => Promise<void>) => Promise<Response | void>,
) {
  return function (
    target: object,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    if (propertyKey && descriptor) {
      const original = descriptor.value
      descriptor.value = async function (ctx: Context) {
        await middleware(ctx, async () => {
          return original.apply(this, [ctx])
        })
      }
      return descriptor
    }

    return target
  }
}
