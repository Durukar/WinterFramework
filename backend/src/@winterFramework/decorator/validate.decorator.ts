import type { Context } from 'hono'
import type { ValidationSchema } from '../registry/controller.registry'

/**
 * Method decorator that validates the JSON request body against a schema.
 * Required fields are checked by key presence; if any field from the schema
 * is missing, a `400` response is returned. The validated body is stored in
 * `ctx.set('validatedBody', body)` for downstream use.
 *
 * @param schema - An object whose keys are required field names and values describe expected types.
 * @returns A method decorator function.
 *
 * @example
 * ```ts
 * @PostMapping()
 * @Validate({ name: 'string', price: 'number' })
 * createProduct(c: Context) {
 *   const body = c.get('validatedBody');
 *   return c.json(body, 201);
 * }
 * ```
 */
export function Validate(schema: ValidationSchema) {
  return function (
    _target: object,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value
    descriptor.value = async function (ctx: Context) {
      try {
        const body = await ctx.req.json() as Record<string, unknown>

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
