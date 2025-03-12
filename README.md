# Winter Framework

[English](#english) | [Português](#português)

---

<a name="português"></a>
## Português

Winter Framework é uma estrutura leve e elegante para construção de APIs REST em TypeScript, inspirada em frameworks populares como Spring Boot e NestJS, mas com foco em simplicidade e desempenho através da biblioteca [Hono](https://hono.dev/).

### Características

- 🚀 **Rápido e Leve**: Construído sobre Hono, oferecendo um excelente desempenho
- 🧩 **Arquitetura Declarativa**: Use decorators para definir rotas e controladores
- 🛠️ **API Fluente**: Interface de configuração encadeada para fácil setup
- 🔄 **Injeção de Parâmetros**: Facilidade para acessar parâmetros de rota, query e corpo da requisição
- 🛡️ **Validação Integrada**: Validação simples de dados de entrada
- 🧠 **Tipagem Forte**: Aproveite o TypeScript para desenvolvimento seguro

### Instalação

```bash
# Clone o repositório
git clone https://github.com/durukar/WinterFramework.git

# Entre na pasta do projeto
cd WinterFramework/backend

# Instale as dependências
bun install
```

### Início Rápido

Crie sua primeira aplicação com Winter Framework em três passos simples:

#### 1. Crie um controlador

```typescript
// UserController.ts

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
    const user = this.users.find(user => user.id === parseInt(id));
    if (!user) return c.json({ error: 'Usuário não encontrado' }, 404);
    return c.json(user);
  }

  @PostMapping()
  create(@RequestBody() body, c) {
    const newUser = {
      id: this.users.length + 1,
      ...body
    };
    this.users.push(newUser);
    return c.json(newUser, 201);
  }
}
```

#### 2. Configure e inicie a aplicação

```typescript
// main.ts

Winter.create()
  .setName('MeuApp')
  .setEnv('dev')  // dev = porta 1337 | prod = porta 8080
  .addController(UserController)
  .addMiddleware((app) => {
    app.use('*', async (ctx, next) => {
      console.log(`${ctx.req.method} ${ctx.req.url}`);
      await next();
    });
  })
  .start();
```

#### 3. Execute sua aplicação

```bash
# Transpile e execute
bun start
```

Sua API estará rodando em http://localhost:1337

### Decorators Disponíveis

#### Controladores e Rotas

- `@RestController(basePath)`: Define um controlador REST com um caminho base
- `@GetMapping(path)`: Mapeia requisições HTTP GET
- `@PostMapping(path)`: Mapeia requisições HTTP POST
- `@PutMapping(path)`: Mapeia requisições HTTP PUT
- `@DeleteMapping(path)`: Mapeia requisições HTTP DELETE
- `@PatchMapping(path)`: Mapeia requisições HTTP PATCH
- `@Options(path)`: Mapeia requisições HTTP OPTIONS
- `@Head(path)`: Mapeia requisições HTTP HEAD

#### Parâmetros

- `@PathParam(name)`: Injeta um parâmetro de rota
- `@QueryParam(name)`: Injeta um parâmetro de query
- `@RequestBody()`: Injeta o corpo da requisição

#### Utilitários

- `@UseMiddleware(middleware)`: Aplica um middleware a um controlador ou método
- `@Validate(schema)`: Valida o corpo da requisição de acordo com um schema

### Configuração Avançada

O Winter Framework oferece uma API fluente para personalizar sua aplicação:

```typescript
Winter.create()
  .setName('API')              // Define o nome da aplicação
  .setEnv('prod')              // Define o ambiente (dev/prod)
  .setPort(3000)               // Sobrescreve a porta padrão
  .addController(Controller1)  // Adiciona controladores
  .addController(Controller2, Controller3)
  .addMiddleware(myMiddleware) // Adiciona middlewares globais
  .start();                    // Inicia o servidor
```

### Middlewares

Adicione facilmente middlewares globais ou específicos:

```typescript
// Middleware global
Winter.create()
  .addMiddleware((app) => {
    app.use('*', async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      console.log(`${ctx.req.method} ${ctx.req.url} - ${ms}ms`);
    });
  })
  .start();

// Middleware específico para um controlador ou método
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

### Validação

Valide facilmente o corpo das requisições:

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
    // Processamento seguro com dados validados
    return c.json({ id: 1, ...body }, 201);
  }
}
```

### Exemplos

#### API REST Completa

```typescript
@RestController('/api/books')
export class BookController {
  private books = [];

  @GetMapping()
  findAll(c) {
    return c.json(this.books);
  }

  @GetMapping('/:id')
  findById(@PathParam('id') id, c) {
    const book = this.books.find(book => book.id === parseInt(id));
    if (!book) return c.json({ error: 'Livro não encontrado' }, 404);
    return c.json(book);
  }

  @PostMapping()
  @Validate({
    title: 'string',
    author: 'string'
  })
  create(c) {
    const body = c.get('validatedBody');
    const newBook = {
      id: this.books.length + 1,
      ...body
    };
    this.books.push(newBook);
    return c.json(newBook, 201);
  }

  @PutMapping('/:id')
  update(@PathParam('id') id, @RequestBody() body, c) {
    const index = this.books.findIndex(book => book.id === parseInt(id));
    if (index === -1) return c.json({ error: 'Livro não encontrado' }, 404);
    
    this.books[index] = {
      ...this.books[index],
      ...body
    };
    
    return c.json(this.books[index]);
  }

  @DeleteMapping('/:id')
  delete(@PathParam('id') id, c) {
    const index = this.books.findIndex(book => book.id === parseInt(id));
    if (index === -1) return c.json({ error: 'Livro não encontrado' }, 404);
    
    const removed = this.books.splice(index, 1);
    return c.json(removed[0]);
  }
}
```

### Dependências

Este framework depende das seguintes bibliotecas:
- [Hono](https://hono.dev/) - Framework HTTP
- [TypeScript](https://www.typescriptlang.org/) - Suporte a tipos e compilação

### Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

### Licença

[APACHE](LICENSE)

### Autor

Desenvolvido e mantido por [Lucas D.](https://github.com/durukar)

---

<a name="english"></a>
## English

Winter Framework is a lightweight and elegant structure for building REST APIs in TypeScript, inspired by popular frameworks like Spring Boot and NestJS, but focused on simplicity and performance through the [Hono](https://hono.dev/) library.

### Features

- 🚀 **Fast and Lightweight**: Built on top of Hono, offering excellent performance
- 🧩 **Declarative Architecture**: Use decorators to define routes and controllers
- 🛠️ **Fluent API**: Chained configuration interface for easy setup
- 🔄 **Parameter Injection**: Easy access to route parameters, query parameters, and request body
- 🛡️ **Integrated Validation**: Simple validation of input data
- 🧠 **Strong Typing**: Leverage TypeScript for safe development

### Installation

```bash
# Clone the repository
git clone https://github.com/durukar/WinterFramework.git

# Enter the project folder
cd WinterFramework/backend

# Install dependencies
bun i or bun install
```

### Quick Start

Create your first application with Winter Framework in three simple steps:

#### 1. Create a controller

```typescript
// UserController.ts

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
    const user = this.users.find(user => user.id === parseInt(id));
    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json(user);
  }

  @PostMapping()
  create(@RequestBody() body, c) {
    const newUser = {
      id: this.users.length + 1,
      ...body
    };
    this.users.push(newUser);
    return c.json(newUser, 201);
  }
}
```

#### 2. Configure and start the application

```typescript
// main.ts

Winter.create()
  .setName('MyApp')
  .setEnv('dev')  // dev = port 1337 | prod = port 8080
  .addController(UserController)
  .addMiddleware((app) => {
    app.use('*', async (ctx, next) => {
      console.log(`${ctx.req.method} ${ctx.req.url}`);
      await next();
    });
  })
  .start();
```

#### 3. Run your application

```bash
# Transpile and run
bun start
```

Your API will be running at http://localhost:1337

### Available Decorators

#### Controllers and Routes

- `@RestController(basePath)`: Defines a REST controller with a base path
- `@GetMapping(path)`: Maps HTTP GET requests
- `@PostMapping(path)`: Maps HTTP POST requests
- `@PutMapping(path)`: Maps HTTP PUT requests
- `@DeleteMapping(path)`: Maps HTTP DELETE requests
- `@PatchMapping(path)`: Maps HTTP PATCH requests
- `@Options(path)`: Maps HTTP OPTIONS requests
- `@Head(path)`: Maps HTTP HEAD requests

#### Parameters

- `@PathParam(name)`: Injects a path parameter
- `@QueryParam(name)`: Injects a query parameter
- `@RequestBody()`: Injects the request body

#### Utilities

- `@UseMiddleware(middleware)`: Applies a middleware to a controller or method
- `@Validate(schema)`: Validates the request body according to a schema

### Advanced Configuration

Winter Framework offers a fluent API to customize your application:

```typescript
Winter.create()
  .setName('API')              // Sets the application name
  .setEnv('prod')              // Sets the environment (dev/prod)
  .setPort(3000)               // Overrides the default port
  .addController(Controller1)  // Adds controllers
  .addController(Controller2, Controller3)
  .addMiddleware(myMiddleware) // Adds global middlewares
  .start();                    // Starts the server
```

### Middlewares

Easily add global or specific middlewares:

```typescript
// Global middleware
Winter.create()
  .addMiddleware((app) => {
    app.use('*', async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      console.log(`${ctx.req.method} ${ctx.req.url} - ${ms}ms`);
    });
  })
  .start();

// Specific middleware for a controller or method
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

### Validation

Easily validate request bodies:

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
    // Safe processing with validated data
    return c.json({ id: 1, ...body }, 201);
  }
}
```

### Examples

#### Complete REST API

```typescript
@RestController('/api/books')
export class BookController {
  private books = [];

  @GetMapping()
  findAll(c) {
    return c.json(this.books);
  }

  @GetMapping('/:id')
  findById(@PathParam('id') id, c) {
    const book = this.books.find(book => book.id === parseInt(id));
    if (!book) return c.json({ error: 'Book not found' }, 404);
    return c.json(book);
  }

  @PostMapping()
  @Validate({
    title: 'string',
    author: 'string'
  })
  create(c) {
    const body = c.get('validatedBody');
    const newBook = {
      id: this.books.length + 1,
      ...body
    };
    this.books.push(newBook);
    return c.json(newBook, 201);
  }

  @PutMapping('/:id')
  update(@PathParam('id') id, @RequestBody() body, c) {
    const index = this.books.findIndex(book => book.id === parseInt(id));
    if (index === -1) return c.json({ error: 'Book not found' }, 404);
    
    this.books[index] = {
      ...this.books[index],
      ...body
    };
    
    return c.json(this.books[index]);
  }

  @DeleteMapping('/:id')
  delete(@PathParam('id') id, c) {
    const index = this.books.findIndex(book => book.id === parseInt(id));
    if (index === -1) return c.json({ error: 'Book not found' }, 404);
    
    const removed = this.books.splice(index, 1);
    return c.json(removed[0]);
  }
}
```

### Dependencies

This framework depends on the following libraries:
- [Hono](https://hono.dev/) - HTTP framework
- [TypeScript](https://www.typescriptlang.org/) - Type support and compilation

### Contributing

Contributions are welcome! Feel free to open issues or pull requests.

### License

[APACHE](LICENSE)

### Author

Developed and maintained by [Lucas D.](https://github.com/durukar)
