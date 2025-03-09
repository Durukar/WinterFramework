/* eslint-disable @typescript-eslint/no-explicit-any */
import { controllers } from '../registry/controller.registry'

function httpMethod(method: string) {
  return function (path: string = '') {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor,
    ) {
      const controllerClass = target.constructor

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

export const GetMapping = httpMethod('get')
export const PostMapping = httpMethod('post')
export const PutMapping = httpMethod('put')
export const DeleteMapping = httpMethod('delete')
export const PatchMapping = httpMethod('patch')
export const Options = httpMethod('options')
export const Head = httpMethod('head')
