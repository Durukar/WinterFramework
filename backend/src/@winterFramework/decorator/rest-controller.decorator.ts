import { controllers, controllersList } from '../registry/controller.registry'
import type { ConstructorFunction } from '../registry/controller.registry'

/**
 * Class decorator that registers a class as a REST controller with a base path.
 * All route methods defined with HTTP method decorators (e.g. {@link GetMapping})
 * will be relative to this base path.
 *
 * @param basePath - The URL prefix for all routes in this controller (default: `''`).
 * @returns A class decorator function.
 *
 * @example
 * ```ts
 * @RestController('/users')
 * export class UserController {
 *   @GetMapping()
 *   findAll(c: Context) {
 *     return c.json([]);
 *   }
 * }
 * ```
 */
export function RestController(basePath: string = '') {
  return function (target: ConstructorFunction) {
    console.log(`Registering controller: ${target.name} in ${basePath}`)
    if (!controllers.has(target)) {
      controllers.set(target, { basePath, routes: [] })
      controllersList.push(target)
      console.log(`Controller list now has ${controllersList.length} items`)
    } else {
      const metadata = controllers.get(target)!
      metadata.basePath = basePath
    }
    return target
  }
}
