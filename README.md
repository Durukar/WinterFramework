<div align="center">

# ❄️ Winter Framework

**A lightweight, elegant REST API framework for TypeScript — inspired by Spring Boot, powered by [Hono](https://hono.dev/).**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-4.12+-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-f9f1e1?logo=bun&logoColor=black)](https://bun.sh/)

🇧🇷 [Leia em Português](README.pt-BR.md) · 📖 [Official Docs](https://www.winterframework.ladavila.com/)

</div>

---

## Why Winter?

Winter Framework brings **Spring Boot's familiar decorator-based architecture** to the TypeScript ecosystem, running on top of Hono — one of the fastest HTTP frameworks available. The result is a framework that is:

- 🚀 **Blazing Fast** — Built on Hono with near-zero overhead
- 🧩 **Declarative** — Define controllers and routes with decorators
- 🛠️ **Fluent API** — Chainable configuration for clean setup
- 🔄 **Auto Parameter Injection** — `@PathParam`, `@QueryParam`, `@RequestBody`
- 🛡️ **Built-in Validation** — Schema-based request body validation
- 💉 **Dependency Injection** — IoC container with `@Injectable` and `@Autowired`
- 🛑 **Exception Handling** — `@ControllerAdvice` + `@ExceptionHandler` like Spring
- 🔀 **Interceptors** — `preHandle` / `postHandle` lifecycle with `@UseInterceptor`
- 🗄️ **Multi-Database** — Drizzle ORM with PostgreSQL, MySQL, and SQLite support
- 🧠 **Type Safe** — Full TypeScript with strict mode

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Decorators API](#decorators-api)
- [Dependency Injection](#dependency-injection)
- [Configuration](#configuration)
- [Middlewares](#middlewares)
- [Validation](#validation)
- [Exception Handling](#exception-handling)
- [Interceptors](#interceptors)
- [Database Support](#database-support)
- [Testing Utilities](#testing-utilities)
- [Examples](#examples)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (latest) or [Node.js](https://nodejs.org/) LTS 22+

### Installation

```bash
git clone https://github.com/durukar/WinterFramework.git
cd WinterFramework/backend
bun install
```

### Hello World in 3 Steps

**1. Create a controller:**

```typescript
import { RestController, GetMapping, PostMapping, PathParam, RequestBody } from './@winterFramework/decorator/winter.decorators'

@RestController('/users')
export class UserController {
  private users = [
    { id: 1, name: 'Lucas D.' },
    { id: 2, name: 'Example User' }
  ];

  @GetMapping()
  findAll(c) {
    return c.json(this.users);
  }

  @GetMapping('/:id')
  findById(@PathParam('id') id, c) {
    const user = this.users.find(u => u.id === parseInt(id));
    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json(user);
  }

  @PostMapping()
  create(@RequestBody() body, c) {
    const newUser = { id: this.users.length + 1, ...body };
    this.users.push(newUser);
    return c.json(newUser, 201);
  }
}
```

**2. Configure and start:**

```typescript
import { Winter } from './@winterFramework/app/winter.app'
import { UserController } from './controllers/UserController'

Winter.create()
  .setName('MyApp')
  .setEnv('dev')        // dev = port 1337 | prod = port 8080
  .addController(UserController)
  .start();
```

**3. Run:**

```bash
bun start
# ✅ MyApp running in dev mode on http://localhost:1337
```

## Architecture

Winter Framework uses a **decorator-driven architecture** with a central controller registry:

```
Request → Hono Router → Controller Registry → Controller Instance → Method Handler
                              ↑                        ↑
                     @RestController              @GetMapping
                     metadata stored              @PathParam
                                                  @RequestBody
```

### Project Structure

```
backend/src/
├── @winterFramework/
│   ├── app/
│   │   ├── winterRunApplication.ts   # Winter class (fluent builder)
│   │   └── register-controllers.app.ts  # Route wiring + param injection
│   ├── decorator/
│   │   ├── rest-controller.decorator.ts  # @RestController
│   │   ├── http-method.decorator.ts      # @GetMapping, @PostMapping, etc.
│   │   ├── path-param.decorator.ts       # @PathParam
│   │   ├── query-param.decorator.ts      # @QueryParam
│   │   ├── request-body.decorator.ts     # @RequestBody
│   │   ├── validate.decorator.ts         # @Validate
│   │   ├── use-middleware.decorator.ts   # @UseMiddleware
│   │   ├── service-repo.decorator.ts     # @ServiceRepo (DB injection)
│   │   └── debugger-logger.decorator.ts  # @DebuggerLogger (dev only)
│   └── registry/
│       └── controller.registry.ts    # Metadata storage
├── config/                           # App configuration
├── db/                               # Database setup (Drizzle)
└── main.ts                           # Entry point
```

## Decorators API

### Controllers & Routes

| Decorator | Description |
|-----------|-------------|
| `@RestController(basePath)` | Registers a class as a REST controller |
| `@GetMapping(path?)` | Maps HTTP GET requests |
| `@PostMapping(path?)` | Maps HTTP POST requests |
| `@PutMapping(path?)` | Maps HTTP PUT requests |
| `@DeleteMapping(path?)` | Maps HTTP DELETE requests |
| `@PatchMapping(path?)` | Maps HTTP PATCH requests |
| `@Options(path?)` | Maps HTTP OPTIONS requests |
| `@Head(path?)` | Maps HTTP HEAD requests |

### Parameters

| Decorator | Description |
|-----------|-------------|
| `@PathParam(name)` | Injects a URL path parameter |
| `@QueryParam(name)` | Injects a query string parameter |
| `@RequestBody()` | Injects the parsed JSON request body |

### Dependency Injection

| Decorator | Description |
|-----------|-------------|
| `@Injectable(scope?)` | Registers a class in the DI container (`singleton` or `transient`) |
| `@Autowired(token)` | Injects a dependency into a class property |

### Exception Handling

| Decorator | Description |
|-----------|-------------|
| `@ControllerAdvice()` | Registers a class as global exception handler |
| `@ExceptionHandler(ExceptionClass)` | Maps a method to handle a specific exception type |

### Interceptors

| Decorator | Description |
|-----------|-------------|
| `@UseInterceptor(InterceptorClass)` | Applies an interceptor to a class or method |

### Utilities

| Decorator | Description |
|-----------|-------------|
| `@UseMiddleware(fn)` | Applies middleware to a method or controller |
| `@Validate(schema)` | Validates the request body against a schema |
| `@ServiceRepo()` | Injects a Drizzle ORM database connection |
| `@DebuggerLogger(options?)` | Logs execution details (**dev only**) |

## Dependency Injection

Winter provides an IoC container inspired by Spring's ApplicationContext:

```typescript
@Injectable()
export class UserRepository {
  findAll() {
    return [{ id: 1, name: 'Lucas' }];
  }
}

@Injectable()
export class UserService {
  @Autowired(UserRepository)
  private repo!: UserRepository;

  findAll() {
    return this.repo.findAll();
  }
}

@RestController('/users')
export class UserController {
  @Autowired(UserService)
  private service!: UserService;

  @GetMapping()
  findAll(c) {
    return c.json(this.service.findAll());
  }
}
```

Register providers in the app builder:

```typescript
Winter.create()
  .addProvider(UserRepository, UserService)
  .addController(UserController)
  .start();
```

## Configuration

```typescript
Winter.create()
  .setName('API')                         // Application name
  .setEnv('prod')                         // Environment: 'dev' (1337) | 'prod' (8080)
  .setPort(3000)                          // Override default port
  .addProvider(MyService)                 // Register DI providers
  .addController(Controller1, Controller2) // Register controllers
  .addControllerAdvice(GlobalHandler)     // Exception handlers
  .addInterceptor(AuthInterceptor)        // Global interceptors
  .addMiddleware(myMiddleware)            // Global middlewares
  .start();                               // Start the server
```

## Middlewares

### Global Middleware

```typescript
Winter.create()
  .addMiddleware((app) => {
    app.use('*', async (ctx, next) => {
      const start = Date.now();
      await next();
      console.log(`${ctx.req.method} ${ctx.req.url} - ${Date.now() - start}ms`);
    });
  })
  .start();
```

### Per-Method Middleware

```typescript
@RestController('/api')
export class ApiController {
  @GetMapping('/secure')
  @UseMiddleware(async (ctx, next) => {
    const token = ctx.req.header('Authorization');
    if (!token) return ctx.json({ error: 'Unauthorized' }, 401);
    await next();
  })
  secureEndpoint(c) {
    return c.json({ message: 'Secure data' });
  }
}
```

## Validation

```typescript
@RestController('/products')
export class ProductController {
  @PostMapping()
  @Validate({
    name: 'string',
    price: 'number',
    description: 'string'
  })
  createProduct(c) {
    const body = c.get('validatedBody');
    return c.json({ id: 1, ...body }, 201);
  }
}
```

## Exception Handling

Centralized error handling inspired by Spring's `@ControllerAdvice`:

```typescript
import { HttpException, NotFoundException, BadRequestException } from './@winterFramework/exceptions/http-exception'

@ControllerAdvice()
export class GlobalExceptionHandler {
  @ExceptionHandler(NotFoundException)
  handleNotFound(err, c) {
    return c.json({ error: err.message }, 404);
  }

  @ExceptionHandler(BadRequestException)
  handleBadRequest(err, c) {
    return c.json({ error: err.message, status: 400 }, 400);
  }

  @ExceptionHandler(HttpException)
  handleGeneric(err, c) {
    return c.json({ error: err.message }, err.status);
  }
}
```

Built-in exception classes: `BadRequestException` (400), `UnauthorizedException` (401), `ForbiddenException` (403), `NotFoundException` (404), `ConflictException` (409), `InternalServerErrorException` (500).

## Interceptors

Pre/post request processing inspired by Spring's `HandlerInterceptor`:

```typescript
@Injectable()
export class AuthInterceptor implements HandlerInterceptor {
  preHandle(ctx) {
    const token = ctx.req.header('Authorization');
    if (!token) throw new UnauthorizedException();
    return true; // proceed to handler
  }

  postHandle(ctx, result) {
    console.log(`Response sent for ${ctx.req.url}`);
  }
}

// Apply to an entire controller
@UseInterceptor(AuthInterceptor)
@RestController('/admin')
export class AdminController { ... }

// Or to a single method
@GetMapping('/metrics')
@UseInterceptor(LoggingInterceptor)
getMetrics(c) { ... }
```

Interceptors run in order: **global → class-level → method-level**.

## Database Support

Winter Framework integrates with [Drizzle ORM](https://orm.drizzle.team/) supporting multiple databases:

| Database | Driver | Package |
|----------|--------|---------|
| PostgreSQL | `pg` | `pg` |
| MySQL | `mysql2` | `mysql2` |
| SQLite / LibSQL | `libsql` | `@libsql/client` |

Use `@ServiceRepo()` to inject a database connection:

```typescript
@ServiceRepo()
@RestController('/products')
export class ProductController {
  async findAll(c) {
    const db = await this.db;
    const products = await db.select().from(productsTable);
    return c.json(products);
  }
}
```

## Examples

### Complete REST API

```typescript
@RestController('/api/books')
export class BookController {
  private books = [];

  @GetMapping()
  findAll(c) { return c.json(this.books); }

  @GetMapping('/:id')
  findById(@PathParam('id') id, c) {
    const book = this.books.find(b => b.id === parseInt(id));
    if (!book) return c.json({ error: 'Book not found' }, 404);
    return c.json(book);
  }

  @PostMapping()
  @Validate({ title: 'string', author: 'string' })
  create(c) {
    const body = c.get('validatedBody');
    const newBook = { id: this.books.length + 1, ...body };
    this.books.push(newBook);
    return c.json(newBook, 201);
  }

  @PutMapping('/:id')
  update(@PathParam('id') id, @RequestBody() body, c) {
    const index = this.books.findIndex(b => b.id === parseInt(id));
    if (index === -1) return c.json({ error: 'Book not found' }, 404);
    this.books[index] = { ...this.books[index], ...body };
    return c.json(this.books[index]);
  }

  @DeleteMapping('/:id')
  delete(@PathParam('id') id, c) {
    const index = this.books.findIndex(b => b.id === parseInt(id));
    if (index === -1) return c.json({ error: 'Book not found' }, 404);
    return c.json(this.books.splice(index, 1)[0]);
  }
}
```

## Testing Utilities

Winter Framework includes a robust, class-based testing architecture inspired by Spring Boot. It uses `bun:test` under the hood and allows you to test your application without binding to a real HTTP port.

### `@WinterTest` & `@MockBean`

Use `@WinterTest` to bootstrap the application context in memory and `@MockBean` to automatically replace real dependencies with mocks.

```typescript
import { expect } from 'bun:test'
import { WinterTest, MockBean, Test, WinterTestClient } from '@winterFramework/testing'

@WinterTest({
  controllers: [UserController],
  providers: [UserService]
})
export class UserControllerTest {
  
  @MockBean(UserService)
  private mockUserService!: UserService

  @Autowired(WinterTestClient)
  private client!: WinterTestClient

  @Test('Should return mocked data')
  async testFindAllUsers() {
    this.mockUserService.findAll = () => [
      { id: 999, name: 'System Mocked User', email: 'mock@system.com' }
    ]

    const res = await this.client.get('/users')
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.length).toBe(1)
  }
}
```

## Roadmap

- [x] Dependency injection container (`@Injectable`, `@Autowired`)
- [x] Exception handling (`@ControllerAdvice`, `@ExceptionHandler`)
- [x] Request interceptors (`HandlerInterceptor`, `@UseInterceptor`)
- [x] Built-in testing utilities (`@WinterTest`, `@MockBean`)
- [ ] OpenAPI / Swagger auto-generation
- [ ] WebSocket support
- [ ] CLI tool for project scaffolding
- [ ] Plugin system for extensibility

## Contributing

Contributions are welcome! Please read our [Contributing Guide](contribution-en_US.md) for details on the process, branch naming, commit conventions, and PR templates.

## Dependencies

| Package | Purpose |
|---------|---------|
| [Hono](https://hono.dev/) | HTTP framework |
| [Drizzle ORM](https://orm.drizzle.team/) | Database ORM |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |

## License

[Apache License 2.0](LICENSE)

## Author

Developed and maintained by [Lucas D.](https://github.com/durukar)

---

<div align="center">

**Built with ❄️ by the Winter Framework community**

</div>
