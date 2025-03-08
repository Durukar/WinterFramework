import { Winter, WinterWelcome } from './@winterFramework'

Winter.create()
  .setName('WinterFramework') // Nome do projeto
  .setEnv('dev') // dev = 1337 | prod = 8080
  // .setPort(3000) // Porta customizada,
  .addController(WinterWelcome) // Controladores | Retire o WinterWelcome caso necessario
  .addMiddleware((app) => {
    // Middlewares
    app.use('*', async (ctx, next) => {
      console.log(`${ctx.req.method} ${ctx.req.url}`)
      await next()
    })
  })
  .start()
