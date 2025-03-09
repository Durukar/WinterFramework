import type { Context } from 'hono'
import { Winter, WinterWelcome } from './@winterFramework/app/winter.app'
import { GetMapping } from './@winterFramework/decorator/http-method.decorator'
import { RestController } from './@winterFramework/decorator/rest-controller.decorator'
import { DebuggerLogger } from './@winterFramework/decorator/debugger-logger.decorator'

Winter.create()
  .setName('WinterFramework') // Project Name
  .setEnv('dev') // dev = 1337 | prod = 8080
  // .setPort(3000) // Custom Port,
  .addController(WinterWelcome) // Controllers | Exclude WinterWelcome controller in prod
  .addMiddleware((app) => {
    // Middlewares
    app.use('*', async (ctx, next) => {
      console.log(`${ctx.req.method} ${ctx.req.url}`)
      await next()
    })
  })
  .start()
