/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable new-cap */
// TODO: documentar o codigo no docussauros
import { Hono, type Context } from 'hono'
import { serve } from '@hono/node-server'
import { registerControllers } from './register-controllers.app'
import { GetMapping, RestController } from '../decorator/winter.decorators'
import { DebuggerLogger } from '../decorator/debugger-logger.decorator'

const envConfigs = {
  dev: { port: 1337 },
  prod: { port: 8080 },
}

export class Winter {
  private app: Hono
  private name: string = 'WinterApp'
  private env: 'dev' | 'prod' = 'dev'
  private port?: number
  private controllers: any[] = []
  private middlewares: Array<(app: Hono) => void> = []

  constructor() {
    this.app = new Hono()
  }

  // Fluent methods for configuration
  public setName(name: string): Winter {
    this.name = name
    return this
  }

  public setEnv(env: 'dev' | 'prod'): Winter {
    this.env = env
    return this
  }

  public setPort(port: number): Winter {
    this.port = port
    return this
  }

  public addController(...controllers: any[]): Winter {
    this.controllers.push(...controllers)
    return this
  }

  public addMiddleware(middleware: (app: Hono) => void): Winter {
    this.middlewares.push(middleware)
    return this
  }

  public getApp(): Hono {
    return this.app
  }

  public start(): void {
    this.middlewares.forEach((middleware) => middleware(this.app))

    // console.log(`Registrando ${this.controllers.length} controladores`)
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

  // TODO: melhorar essa instanciação para evitar problema no timing de execução dos decorators
  public static create(): Winter {
    return new Winter()
  }
}

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
