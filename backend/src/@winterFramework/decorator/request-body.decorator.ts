import { paramMetadata } from '../registry/controller.registry'
import type { ConstructorFunction } from '../registry/controller.registry'

/**
 * Parameter decorator that injects the parsed JSON request body into a controller method argument.
 * Falls back to an empty object `{}` if parsing fails.
 *
 * @returns A parameter decorator function.
 *
 * @example
 * ```ts
 * @PostMapping()
 * create(@RequestBody() body: CreateUserDto, c: Context) {
 *   return c.json(body, 201);
 * }
 * ```
 */
export function RequestBody() {
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
      type: 'body',
    })
  }
}
