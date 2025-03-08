/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Context, Hono } from 'hono'
import {
  controllersList,
  controllers,
  paramMetadata,
} from '../registry/controllerRegistry'

// const controllers: Map<
//   any,
//   {
//     basePath: string
//     routes: { method: string; path: string; handler: string }[]
//   }
// > = new Map()

// const paramMetadata: Map<
//   any,
//   Map<
//     string,
//     { index: number; type: 'param' | 'query' | 'body'; name?: string }[]
//   >
// > = new Map()

export function RestController(basePath: string = '') {
  return function (target: any) {
    console.log(`Registering controller: ${target.name} in ${basePath}`)
    if (!controllers.has(target)) {
      controllers.set(target, { basePath, routes: [] })
      controllersList.push(target)
      console.log(
        `Controller list now has ${controllersList.length} items`,
      )
    } else {
      const metadata = controllers.get(target)!
      metadata.basePath = basePath
    }
    return target
  }
}

function createMethodDecorator(method: string) {
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

export const GetMapping = createMethodDecorator('get')
export const PostMapping = createMethodDecorator('post')
export const PutMapping = createMethodDecorator('put')
export const DeleteMapping = createMethodDecorator('delete')
export const PatchMapping = createMethodDecorator('patch')
export const Options = createMethodDecorator('options')
export const Head = createMethodDecorator('head')

export function PathParam(paramName: string) {
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
      type: 'param',
      name: paramName,
    })
  }
}

export function QueryParam(paramName: string) {
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
      type: 'query',
      name: paramName,
    })
  }
}

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

export function UseMiddleware(
  middleware: (ctx: Context, next: () => Promise<void>) => Promise<any>,
) {
  return function (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor,
  ) {
    if (propertyKey && descriptor) {
      const original = descriptor.value
      descriptor.value = async function (ctx: Context) {
        await middleware(ctx, async () => {
          return original.apply(this, [ctx])
        })
      }
      return descriptor
    }

    return target
  }
}

export function Validate(schema: any) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value
    descriptor.value = async function (ctx: Context) {
      try {
        const body = await ctx.req.json()

        const requiredFields = Object.keys(schema)
        for (const field of requiredFields) {
          if (body[field] === undefined) {
            return ctx.json({ error: `${field} field is mandatory` }, 400)
          }
        }

        ctx.set('validatedBody', body)
        return original.apply(this, [ctx])
      } catch (error) {
        return ctx.json({ error: 'Validation error', details: error }, 400)
      }
    }
    return descriptor
  }
}
