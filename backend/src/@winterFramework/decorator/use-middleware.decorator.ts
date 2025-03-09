/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from 'hono'

export function UseMiddleware(
  middleware: (ctx: Context, next: () => Promise<void>) => Promise<any>,
) {
  return function (
    target: any,
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
