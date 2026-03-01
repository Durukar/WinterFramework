<div align="center">

# ❄️ Winter Framework

**Um framework leve e elegante para APIs REST em TypeScript — inspirado no Spring Boot, construído sobre o [Hono](https://hono.dev/).**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Hono](https://img.shields.io/badge/Hono-4.12+-E36002?logo=hono&logoColor=white)](https://hono.dev/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-f9f1e1?logo=bun&logoColor=black)](https://bun.sh/)

🇺🇸 [Read in English](README.md) · 📖 [Documentação Oficial](https://www.winterframework.ladavila.com/)

</div>

---

## Por que Winter?

O Winter Framework traz a **arquitetura familiar de decorators do Spring Boot** para o ecossistema TypeScript, rodando sobre o Hono — um dos frameworks HTTP mais rápidos disponíveis. O resultado é um framework que é:

- 🚀 **Ultra Rápido** — Construído sobre o Hono com overhead quase zero
- 🧩 **Declarativo** — Defina controladores e rotas com decorators
- 🛠️ **API Fluente** — Configuração encadeada para um setup limpo
- 🔄 **Injeção de Parâmetros** — `@PathParam`, `@QueryParam`, `@RequestBody`
- 🛡️ **Validação Integrada** — Validação de corpo da requisição baseada em schema
- 🗄️ **Multi-Banco** — Drizzle ORM com suporte a PostgreSQL, MySQL e SQLite
- 🧠 **Type Safe** — TypeScript completo com modo strict

## Sumário

- [Início Rápido](#início-rápido)
- [Arquitetura](#arquitetura)
- [API de Decorators](#api-de-decorators)
- [Configuração](#configuração)
- [Middlewares](#middlewares)
- [Validação](#validação)
- [Suporte a Banco de Dados](#suporte-a-banco-de-dados)
- [Exemplos](#exemplos)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Início Rápido

### Pré-requisitos

- [Bun](https://bun.sh/) (última versão) ou [Node.js](https://nodejs.org/) LTS 22+

### Instalação

```bash
git clone https://github.com/durukar/WinterFramework.git
cd WinterFramework/backend
bun install
```

### Hello World em 3 Passos

**1. Crie um controlador:**

```typescript
import { RestController, GetMapping, PostMapping, PathParam, RequestBody } from './@winterFramework/decorator/winter.decorators'

@RestController('/users')
export class UserController {
  private users = [
    { id: 1, name: 'Lucas D.' },
    { id: 2, name: 'Usuário Exemplo' }
  ];

  @GetMapping()
  findAll(c) {
    return c.json(this.users);
  }

  @GetMapping('/:id')
  findById(@PathParam('id') id, c) {
    const user = this.users.find(u => u.id === parseInt(id));
    if (!user) return c.json({ error: 'Usuário não encontrado' }, 404);
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

**2. Configure e inicie:**

```typescript
import { Winter } from './@winterFramework/app/winter.app'
import { UserController } from './controllers/UserController'

Winter.create()
  .setName('MeuApp')
  .setEnv('dev')        // dev = porta 1337 | prod = porta 8080
  .addController(UserController)
  .start();
```

**3. Execute:**

```bash
bun start
# ✅ MeuApp running in dev mode on http://localhost:1337
```

## Arquitetura

O Winter Framework usa uma **arquitetura orientada a decorators** com um registro central de controladores:

```
Request → Hono Router → Controller Registry → Controller Instance → Method Handler
                              ↑                        ↑
                     @RestController              @GetMapping
                     metadata armazenado          @PathParam
                                                  @RequestBody
```

### Estrutura do Projeto

```
backend/src/
├── @winterFramework/
│   ├── app/
│   │   ├── winterRunApplication.ts   # Classe Winter (builder fluente)
│   │   └── register-controllers.app.ts  # Wiring de rotas + injeção de params
│   ├── decorator/
│   │   ├── rest-controller.decorator.ts  # @RestController
│   │   ├── http-method.decorator.ts      # @GetMapping, @PostMapping, etc.
│   │   ├── path-param.decorator.ts       # @PathParam
│   │   ├── query-param.decorator.ts      # @QueryParam
│   │   ├── request-body.decorator.ts     # @RequestBody
│   │   ├── validate.decorator.ts         # @Validate
│   │   ├── use-middleware.decorator.ts   # @UseMiddleware
│   │   ├── service-repo.decorator.ts     # @ServiceRepo (injeção de DB)
│   │   └── debugger-logger.decorator.ts  # @DebuggerLogger (apenas dev)
│   └── registry/
│       └── controller.registry.ts    # Armazenamento de metadata
├── config/                           # Configuração do app
├── db/                               # Setup do banco (Drizzle)
└── main.ts                           # Ponto de entrada
```

## API de Decorators

### Controladores e Rotas

| Decorator | Descrição |
|-----------|-----------|
| `@RestController(basePath)` | Registra uma classe como controlador REST |
| `@GetMapping(path?)` | Mapeia requisições HTTP GET |
| `@PostMapping(path?)` | Mapeia requisições HTTP POST |
| `@PutMapping(path?)` | Mapeia requisições HTTP PUT |
| `@DeleteMapping(path?)` | Mapeia requisições HTTP DELETE |
| `@PatchMapping(path?)` | Mapeia requisições HTTP PATCH |
| `@Options(path?)` | Mapeia requisições HTTP OPTIONS |
| `@Head(path?)` | Mapeia requisições HTTP HEAD |

### Parâmetros

| Decorator | Descrição |
|-----------|-----------|
| `@PathParam(name)` | Injeta um parâmetro de rota |
| `@QueryParam(name)` | Injeta um parâmetro de query string |
| `@RequestBody()` | Injeta o corpo da requisição JSON parseado |

### Utilitários

| Decorator | Descrição |
|-----------|-----------|
| `@UseMiddleware(fn)` | Aplica middleware a um método ou controlador |
| `@Validate(schema)` | Valida o corpo da requisição contra um schema |
| `@ServiceRepo()` | Injeta uma conexão Drizzle ORM |
| `@DebuggerLogger(options?)` | Log de detalhes de execução (**apenas dev**) |

## Configuração

```typescript
Winter.create()
  .setName('API')              // Nome da aplicação
  .setEnv('prod')              // Ambiente: 'dev' (1337) | 'prod' (8080)
  .setPort(3000)               // Sobrescreve a porta padrão
  .addController(Controller1)  // Registra controladores
  .addController(Controller2, Controller3)
  .addMiddleware(myMiddleware) // Middlewares globais
  .start();                    // Inicia o servidor
```

## Middlewares

### Middleware Global

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

### Middleware por Método

```typescript
@RestController('/api')
export class ApiController {
  @GetMapping('/secure')
  @UseMiddleware(async (ctx, next) => {
    const token = ctx.req.header('Authorization');
    if (!token) return ctx.json({ error: 'Não autorizado' }, 401);
    await next();
  })
  secureEndpoint(c) {
    return c.json({ message: 'Dados seguros' });
  }
}
```

## Validação

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

## Suporte a Banco de Dados

O Winter Framework integra com o [Drizzle ORM](https://orm.drizzle.team/) suportando múltiplos bancos:

| Banco | Driver | Pacote |
|-------|--------|--------|
| PostgreSQL | `pg` | `pg` |
| MySQL | `mysql2` | `mysql2` |
| SQLite / LibSQL | `libsql` | `@libsql/client` |

Use `@ServiceRepo()` para injetar uma conexão:

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

## Exemplos

### API REST Completa

```typescript
@RestController('/api/books')
export class BookController {
  private books = [];

  @GetMapping()
  findAll(c) { return c.json(this.books); }

  @GetMapping('/:id')
  findById(@PathParam('id') id, c) {
    const book = this.books.find(b => b.id === parseInt(id));
    if (!book) return c.json({ error: 'Livro não encontrado' }, 404);
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
    if (index === -1) return c.json({ error: 'Livro não encontrado' }, 404);
    this.books[index] = { ...this.books[index], ...body };
    return c.json(this.books[index]);
  }

  @DeleteMapping('/:id')
  delete(@PathParam('id') id, c) {
    const index = this.books.findIndex(b => b.id === parseInt(id));
    if (index === -1) return c.json({ error: 'Livro não encontrado' }, 404);
    return c.json(this.books.splice(index, 1)[0]);
  }
}
```

## Roadmap

- [ ] Container de injeção de dependências
- [ ] Geração automática de OpenAPI / Swagger
- [ ] Suporte a WebSocket
- [ ] CLI para scaffolding de projetos
- [ ] Sistema de plugins para extensibilidade
- [ ] Utilitários de teste integrados

## Contribuindo

Contribuições são bem-vindas! Leia nosso [Guia de Contribuição](contribution-pt_BR.md) para detalhes sobre o processo, convenção de branches, commits e templates de PR.

## Dependências

| Pacote | Finalidade |
|--------|-----------|
| [Hono](https://hono.dev/) | Framework HTTP |
| [Drizzle ORM](https://orm.drizzle.team/) | ORM para banco de dados |
| [TypeScript](https://www.typescriptlang.org/) | Segurança de tipos |

## Licença

[Apache License 2.0](LICENSE)

## Autor

Desenvolvido e mantido por [Lucas D.](https://github.com/durukar)

---

<div align="center">

**Construído com ❄️ pela comunidade Winter Framework**

</div>
