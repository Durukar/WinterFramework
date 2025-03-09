/* eslint-disable @typescript-eslint/no-explicit-any */
export const controllersList: any[] = []
export const controllers: Map<any, { basePath: string; routes: any[] }> =
  new Map()
export const paramMetadata: Map<any, Map<string, any[]>> = new Map()

export function getRegisteredControllers() {
  return [...controllersList]
}
