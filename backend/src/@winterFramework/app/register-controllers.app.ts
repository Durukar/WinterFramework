/* eslint-disable new-cap */
import type { Context, Hono } from 'hono'
import { controllers, paramMetadata } from '../registry/controller.registry'
import type { ConstructorFunction, HttpMethod } from '../registry/controller.registry'
import { WinterContainer } from '../container/winter-container'
import { resolveExceptionHandler } from '../registry/exception-handler.registry'
import { resolveInterceptors } from '../registry/interceptor.registry'

/**
 * Iterates over provided controller classes, resolves each one via the DI container,
 * and registers their decorated routes with the Hono application.
 * Handles parameter injection, interceptor execution, and exception handling.
 *
 * @param app - The Hono application instance to register routes on.
 * @param controllerClasses - Array of controller constructor functions decorated with {@link RestController}.
 * @returns The Hono app instance (for chaining).
 */
export function registerControllers(app: Hono, controllerClasses: ConstructorFunction[]) {
  const container = WinterContainer.getInstance()

  controllerClasses.forEach((controllerClass) => {
    const metadata = controllers.get(controllerClass)
    if (!metadata) return

    // Resolve controller via DI container (injects @Autowired dependencies)
    const instance = container.resolve<Record<string, (...args: unknown[]) => unknown>>(controllerClass)
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
        try {
          // --- Interceptors: preHandle ---
          const interceptors = resolveInterceptors(controllerClass, handler)
          for (const interceptor of interceptors) {
            const proceed = await interceptor.preHandle(ctx)
            if (!proceed) {
              return ctx.json({ error: 'Request blocked by interceptor' }, 403) as unknown as Response
            }
          }

          // --- Build parameters ---
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

          // --- Execute handler ---
          let result: Response
          if (classParamMetadata && classParamMetadata.has(handler)) {
            params.push(ctx)
            result = instance[handler](...params) as Response
          } else {
            result = instance[handler](ctx) as Response
          }

          // --- Interceptors: postHandle ---
          for (const interceptor of interceptors) {
            if (interceptor.postHandle) {
              await interceptor.postHandle(ctx, result)
            }
          }

          return result
        } catch (error: unknown) {
          // --- Exception handling via @ControllerAdvice ---
          return resolveExceptionHandler(error, ctx)
        }
      })
    })
  })

  return app
}
