import { Winter, WinterWelcome } from './@winterFramework/app/winter.app'

// --- DI Example ---
import { UserService } from './examples/user.service'
import { UserController } from './examples/user.controller'

// --- Exception Handling Example ---
import { GlobalExceptionHandler } from './examples/global-exception-handler'

// --- Interceptor Examples ---
import { LoggingInterceptor } from './examples/logging.interceptor'
import { InterceptorExampleController } from './examples/interceptor-example.controller'

// --- Parameter Injection Example ---
import { ParamExampleController } from './examples/params-example.controller'

// --- Validation Example ---
import { ValidationExampleController } from './examples/validation-example.controller'

// --- Middleware Example ---
import { MiddlewareExampleController } from './examples/middleware-example.controller'

// --- DebuggerLogger Example ---
import { DebugExampleController } from './examples/debugger-example.controller'

Winter.create()
  .setName('WinterFramework') // Project Name
  .setEnv('dev') // dev = 1337 | prod = 8080

  // DI Providers
  .addProvider(UserService)

  // Controllers
  .addController(
    WinterWelcome,
    UserController,
    ParamExampleController,
    ValidationExampleController,
    MiddlewareExampleController,
    DebugExampleController,
    InterceptorExampleController,
  )

  // Exception handling
  .addControllerAdvice(GlobalExceptionHandler)

  // Global interceptors
  .addInterceptor(LoggingInterceptor)

  .start()
