/* eslint-disable @typescript-eslint/no-explicit-any */
import { controllers, controllersList } from '../registry/controller.registry'

export function RestController(basePath: string = '') {
  return function (target: any) {
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
