/* eslint-disable new-cap */
import type { Context, Hono } from 'hono'
import { controllers, paramMetadata } from '../registry/controller.registry'
import type { ConstructorFunction, HttpMethod } from '../registry/controller.registry'

/**
 * Iterates over provided controller classes, instantiates each one, and
 * registers their decorated routes with the Hono application.
 * Handles parameter injection for {@link PathParam}, {@link QueryParam}, and {@link RequestBody}.
 *
 * @param app - The Hono application instance to register routes on.
 * @param controllerClasses - Array of controller constructor functions decorated with {@link RestController}.
 * @returns The Hono app instance (for chaining).
 */
export function registerControllers(app: Hono, controllerClasses: ConstructorFunction[]) {
  controllerClasses.forEach((controllerClass) => {
    const metadata = controllers.get(controllerClass)
    if (!metadata) return

    const instance = new controllerClass() as Record<string, (...args: unknown[]) => unknown>
    const { basePath, routes } = metadata

    routes.forEach((route) => {
      const { method, path, handler } = route
      const fullPath = `${basePath}${path}`

      type HonoRouteHandler = (
        path: string,
        handler: (ctx: Context) => Promise<Response | void>
      ) => void

      const honoMethod = (
        app as unknown as Record<HttpMethod, HonoRouteHandler>
      )[method].bind(app)

      honoMethod(fullPath, async (ctx: Context) => {
        const params: unknown[] = []
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
          return instance[handler](...params) as Response
        }

        return instance[handler](ctx) as Response
      })
    })
  })

  return app
}
