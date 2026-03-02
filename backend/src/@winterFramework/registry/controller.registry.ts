/**
 * Type representing a constructor function (class) that can be instantiated with `new`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConstructorFunction = new (...args: any[]) => object

/**
 * Supported HTTP methods that can be registered with Hono.
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

/**
 * Metadata for a single route registered by an HTTP method decorator.
 */
export interface RouteMetadata {
  /** The HTTP method verb (e.g. `'get'`, `'post'`). */
  method: HttpMethod
  /** The URL path relative to the controller's base path. */
  path: string
  /** The name of the method on the controller class that handles this route. */
  handler: string
}

/**
 * Metadata for a controller class, containing its base URL path and registered routes.
 */
export interface ControllerMetadata {
  /** The URL prefix for all routes in this controller. */
  basePath: string
  /** Array of route definitions registered by HTTP method decorators. */
  routes: RouteMetadata[]
}

/**
 * Supported parameter injection types.
 */
export type ParamType = 'param' | 'query' | 'body'

/**
 * Describes a single parameter injection for a controller method.
 */
export interface ParamDescriptor {
  /** The positional index of the parameter in the method signature. */
  index: number
  /** The type of injection: path param, query param, or request body. */
  type: ParamType
  /** The name of the parameter to extract (optional for `'body'` type). */
  name?: string
}

/**
 * Validation schema — an object mapping field names to their expected type names.
 */
export type ValidationSchema = Record<string, string>

/**
 * Ordered list of registered controller classes.
 * Populated by the {@link RestController} decorator at class decoration time.
 */
export const controllersList: ConstructorFunction[] = []

/**
 * Map of controller classes to their metadata (base path and route definitions).
 * Used internally by {@link registerControllers} to wire routes into Hono.
 */
export const controllers: Map<ConstructorFunction, ControllerMetadata> =
  new Map()

/**
 * Map of controller classes to their parameter injection metadata.
 * Stores per-method parameter descriptors populated by
 * {@link PathParam}, {@link QueryParam}, and {@link RequestBody} decorators.
 */
export const paramMetadata: Map<ConstructorFunction, Map<string, ParamDescriptor[]>> = new Map()

/**
 * Returns a shallow copy of all registered controller classes.
 * @returns An array of controller constructor functions.
 */
export function getRegisteredControllers(): ConstructorFunction[] {
  return [...controllersList]
}
