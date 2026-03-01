import { paramMetadata } from '../registry/controller.registry'
import type { ConstructorFunction } from '../registry/controller.registry'

/**
 * Parameter decorator that injects a URL path parameter into a controller method argument.
 *
 * @param paramName - The name of the route parameter to extract (must match the `:name` in the route path).
 * @returns A parameter decorator function.
 *
 * @example
 * ```ts
 * @GetMapping('/:id')
 * findById(@PathParam('id') id: string, c: Context) {
 *   return c.json({ id });
 * }
 * ```
 */
export function PathParam(paramName: string) {
  return function (target: object, methodName: string, paramIndex: number) {
    const controllerClass = target.constructor as ConstructorFunction

    if (!paramMetadata.has(controllerClass)) {
      paramMetadata.set(controllerClass, new Map())
    }

    const classMetadata = paramMetadata.get(controllerClass)!
    if (!classMetadata.has(methodName)) {
      classMetadata.set(methodName, [])
    }

    const methodMetadata = classMetadata.get(methodName)!
    methodMetadata.push({
      index: paramIndex,
      type: 'param',
      name: paramName,
    })
  }
}
