/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable new-cap */
import type { Context, Hono } from 'hono'
import { controllers, paramMetadata } from '../registry/controller.registry'

export function registerControllers(app: Hono, controllerClasses: any[]) {
  // console.log(`Registrando ${controllerClasses.length} controladores`)
  controllerClasses.forEach((controllerClass) => {
    const metadata = controllers.get(controllerClass)
    if (!metadata) return

    const instance = new controllerClass()
    const { basePath, routes } = metadata

    routes.forEach((route) => {
      const { method, path, handler } = route
      const fullPath = `${basePath}${path}`

      app[method](fullPath, async (ctx: Context) => {
        const params: any[] = []
        const classParamMetadata = paramMetadata.get(controllerClass)

        if (classParamMetadata && classParamMetadata.has(handler)) {
          const methodParams = classParamMetadata.get(handler)!

          methodParams.sort((a, b) => a.index - b.index)

          const maxIndex = methodParams.reduce(
            (max, param) => Math.max(max, param.index),
            -1,
          )
          for (let i = 0; i <= maxIndex; i++) {
            params.push(undefined)
          }

          for (const param of methodParams) {
            if (param.type === 'param' && param.name) {
              params[param.index] = ctx.req.param(param.name)
            } else if (param.type === 'query' && param.name) {
              params[param.index] = ctx.req.query(param.name)
            } else if (param.type === 'body') {
              params[param.index] = await ctx.req.json().catch(() => ({}))
            }
          }
        }

        if (classParamMetadata && classParamMetadata.has(handler)) {
          params.push(ctx)
          return instance[handler](...params)
        }

        return instance[handler](ctx)
      })
    })
  })

  return app
}
