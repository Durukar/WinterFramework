/* eslint-disable @typescript-eslint/no-explicit-any */
import { paramMetadata } from '../registry/controller.registry'

export function RequestBody() {
  return function (target: any, methodName: string, paramIndex: number) {
    if (!paramMetadata.has(target.constructor)) {
      paramMetadata.set(target.constructor, new Map())
    }

    const classMetadata = paramMetadata.get(target.constructor)!
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
