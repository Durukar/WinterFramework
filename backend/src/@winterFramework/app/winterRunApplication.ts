/* eslint-disable new-cap */
import { Hono, type Context } from 'hono'
import { serve } from '@hono/node-server'
import { registerControllers } from './register-controllers.app'
import { GetMapping, RestController } from '../decorator/winter.decorators'
import { DebuggerLogger } from '../decorator/debugger-logger.decorator'
import type { ConstructorFunction } from '../registry/controller.registry'

/** Default port configuration per environment. */
const envConfigs = {
  dev: { port: 1337 },
  prod: { port: 8080 },
}

/**
 * Main application class for Winter Framework.
 * Provides a fluent builder API for configuring and starting a Hono-powered REST server.
 *
 * @example
 * ```ts
 * Winter.create()
 *   .setName('MyAPI')
 *   .setEnv('dev')
 *   .addController(UserController)
 *   .start();
 * ```
 */
export class Winter {
  private app: Hono
  private name: string = 'WinterApp'
  private env: 'dev' | 'prod' = 'dev'
  private port?: number
  private controllers: ConstructorFunction[] = []
  private middlewares: Array<(app: Hono) => void> = []

  constructor() {
    this.app = new Hono()
  }

  /**
   * Sets the application display name (shown in startup logs).
   * @param name - The application name.
   */
  public setName(name: string): Winter {
    this.name = name
    return this
  }

  /**
   * Sets the runtime environment. `'dev'` defaults to port 1337, `'prod'` to 8080.
   * @param env - The environment mode.
   */
  public setEnv(env: 'dev' | 'prod'): Winter {
    this.env = env
    return this
  }

  /**
   * Overrides the default port for the current environment.
   * @param port - The port number to listen on.
   */
  public setPort(port: number): Winter {
    this.port = port
    return this
  }

  /**
   * Registers one or more controller classes to be wired into the Hono router.
   * Controllers must be decorated with {@link RestController}.
   * @param controllers - Controller constructor functions.
   */
  public addController(...controllers: ConstructorFunction[]): Winter {
    this.controllers.push(...controllers)
    return this
  }

  /**
   * Registers a global middleware function that receives the Hono app instance.
   * @param middleware - A function that applies middleware to the Hono app (e.g. `app.use('*', ...)`)).
   */
  public addMiddleware(middleware: (app: Hono) => void): Winter {
    this.middlewares.push(middleware)
    return this
  }

  /**
   * Returns the underlying Hono app instance for advanced configuration.
   */
  public getApp(): Hono {
    return this.app
  }

  /**
   * Applies middlewares, registers controllers, and starts the HTTP server.
   */
  public start(): void {
    this.middlewares.forEach((middleware) => middleware(this.app))

    registerControllers(this.app, this.controllers)

    const configPort = envConfigs[this.env].port
    const port = this.port || configPort

    serve(
      {
        fetch: this.app.fetch,
        port,
      },
      () => {
        console.log(
          `${this.name} running in ${this.env} mode on http://localhost:${port}`,
        )
      },
    )
  }

  /**
   * Factory method — creates a new Winter application instance.
   * @returns A new {@link Winter} builder instance.
   */
  public static create(): Winter {
    return new Winter()
  }
}

/**
 * Built-in welcome controller that responds on `GET /` with framework metadata.
 * Useful for development; exclude from production builds.
 */
@RestController('/')
export class WinterWelcome {
  @GetMapping()
  @DebuggerLogger()
  welcomeDev(c: Context) {
    return c.json({
      dev: 'Developed and maintained by Lucas D.',
      gitHub: 'https://github.com/durukar',
      stack: 'JS, HONOJS, TS',
    })
  }
}
