import { paramMetadata } from '../registry/controller.registry'
import type { ConstructorFunction } from '../registry/controller.registry'

/**
 * Parameter decorator that injects a URL query parameter into a controller method argument.
 *
 * @param paramName - The name of the query string parameter to extract.
 * @returns A parameter decorator function.
 *
 * @example
 * ```ts
 * @GetMapping('/search')
 * search(@QueryParam('q') query: string, c: Context) {
 *   return c.json({ query });
 * }
 * ```
 */
export function QueryParam(paramName: string) {
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
      type: 'query',
      name: paramName,
    })
  }
}
