/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from 'hono'

export function Validate(schema: any) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value
    descriptor.value = async function (ctx: Context) {
      try {
        const body = await ctx.req.json()

        const requiredFields = Object.keys(schema)
        for (const field of requiredFields) {
          if (body[field] === undefined) {
            return ctx.json({ error: `${field} field is mandatory` }, 400)
          }
        }

        ctx.set('validatedBody', body)
        return original.apply(this, [ctx])
      } catch (error) {
        return ctx.json({ error: 'Validation error', details: error }, 400)
      }
    }
    return descriptor
  }
}
