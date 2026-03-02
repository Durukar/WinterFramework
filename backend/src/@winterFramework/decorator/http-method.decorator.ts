import { controllers } from '../registry/controller.registry'
import type { HttpMethod } from '../registry/controller.registry'

/**
 * Factory function that creates an HTTP method decorator for a given HTTP verb.
 * Used internally to generate {@link GetMapping}, {@link PostMapping}, etc.
 *
 * @param method - The HTTP method name (e.g. `'get'`, `'post'`).
 * @returns A decorator factory that accepts an optional route path.
 */
function httpMethod(method: HttpMethod) {
  return function (path: string = '') {
    return function (
      target: object,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      const controllerClass = target.constructor as new (...args: unknown[]) => object

      if (!controllers.has(controllerClass)) {
        controllers.set(controllerClass, { basePath: '', routes: [] })
      }

      const metadata = controllers.get(controllerClass)!
      metadata.routes.push({
        method,
        path,
        handler: propertyKey,
      })

      return descriptor
    }
  }
}

/** Maps a method to handle HTTP **GET** requests. @param path - Route path relative to the controller base (default: `''`). */
export const GetMapping = httpMethod('get')
/** Maps a method to handle HTTP **POST** requests. @param path - Route path relative to the controller base (default: `''`). */
export const PostMapping = httpMethod('post')
/** Maps a method to handle HTTP **PUT** requests. @param path - Route path relative to the controller base (default: `''`). */
export const PutMapping = httpMethod('put')
/** Maps a method to handle HTTP **DELETE** requests. @param path - Route path relative to the controller base (default: `''`). */
export const DeleteMapping = httpMethod('delete')
/** Maps a method to handle HTTP **PATCH** requests. @param path - Route path relative to the controller base (default: `''`). */
export const PatchMapping = httpMethod('patch')
/** Maps a method to handle HTTP **OPTIONS** requests. @param path - Route path relative to the controller base (default: `''`). */
export const Options = httpMethod('options')
/** Maps a method to handle HTTP **HEAD** requests. @param path - Route path relative to the controller base (default: `''`). */
export const Head = httpMethod('head')
