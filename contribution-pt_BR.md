# 🤝 Guia de Contribuição

Bem-vindo ao **WinterFramework**! Agradecemos seu interesse em contribuir. Este guia explica como você pode ajudar a melhorar o projeto.

## Sumário

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Convenção de Branches](#convenção-de-branches)
- [Convenção de Commits](#convenção-de-commits)
- [Processo de Pull Request](#processo-de-pull-request)
- [Diretrizes de Código](#diretrizes-de-código)
- [Reportando Bugs](#reportando-bugs)
- [Código de Conduta](#código-de-conduta)
- [Contato](#contato)

## Como Contribuir

1. **Fork o Repositório** — Faça um fork deste repositório para sua conta no GitHub.
2. **Clone o Repositório** — Clone o fork para sua máquina local:
   ```bash
   git clone https://github.com/<seu-usuario>/WinterFramework.git
   ```
3. **Crie uma Branch** — Crie uma branch seguindo a [convenção de nomes](#convenção-de-branches):
   ```bash
   git checkout -b feature/nome-da-feature
   ```
4. **Faça suas Alterações** — Implemente suas mudanças no código.
5. **Teste** — Certifique-se de que suas alterações funcionam e não quebram nada existente.
6. **Commit** — Siga a [convenção de commits](#convenção-de-commits).
7. **Push** — Envie suas alterações para o fork:
   ```bash
   git push origin feature/nome-da-feature
   ```
8. **Pull Request** — Abra um PR seguindo o [processo de PR](#processo-de-pull-request).

## Configuração do Ambiente

### Requisitos
- **Bun** (última versão)
- **Node.js** LTS 22 ou versão LTS superior

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/durukar/WinterFramework.git

# 2. Acesse a pasta backend
cd WinterFramework/backend

# 3. Instale as dependências
bun install

# 4. Copie e configure as variáveis de ambiente
cp .env.example .env

# 5. Execute o projeto
bun start
```

## Convenção de Branches

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Nova feature | `feature/<descrição>` | `feature/add-cors-support` |
| Correção de bug | `bugfix/<descrição>` | `bugfix/fix-param-injection` |
| Documentação | `docs/<descrição>` | `docs/update-readme` |
| Refatoração | `refactor/<descrição>` | `refactor/simplify-registry` |

## Convenção de Commits

Seguimos a especificação [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<escopo>): <descrição>

[corpo opcional]
```

**Tipos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Exemplos:**
```
feat(decorator): add @Header decorator for response headers
fix(validator): handle undefined body gracefully
docs(readme): add database configuration section
```

## Processo de Pull Request

1. **Título e descrição** devem ser escritos em **Português** e **Inglês**.
2. Preencha o template de PR abaixo.
3. Certifique-se de que toda a funcionalidade existente continua funcionando.
4. Solicite revisão de pelo menos um mantenedor.

### Template de PR

```markdown
## 🇧🇷 Descrição / 🇺🇸 Description
<!-- Descreva suas mudanças / Describe your changes -->

## Tipo de Mudança / Change Type
- [ ] Nova feature / New feature
- [ ] Correção de bug / Bug fix
- [ ] Documentação / Documentation
- [ ] Refatoração / Refactoring

## Checklist
- [ ] Meu código segue o estilo do projeto / My code follows the project style
- [ ] Testei minhas mudanças / I tested my changes
- [ ] Atualizei a documentação (se necessário) / I updated docs (if needed)
```

## Diretrizes de Código

- Siga o estilo e as convenções de código já existentes.
- Use **TypeScript** com modo strict habilitado.
- Documente seu código com comentários **JSDoc**, especialmente em lógicas complexas.
- Use o padrão de decorators existente ao adicionar novas features ao framework.
- Mantenha os imports organizados (simple-import-sort está configurado).

## Reportando Bugs

Se encontrar um bug, abra uma issue com:

- **Descrição do problema** — O que aconteceu?
- **Passos para reproduzir** — Como podemos reproduzir o problema?
- **Comportamento esperado vs. observado** — O que você esperava que acontecesse?
- **Ambiente** — SO, versão do Node.js, versão do Bun.

## Código de Conduta

- Seja respeitoso e construtivo em todas as interações.
- Acolha iniciantes e ajude-os a começar.
- Foque no problema, não na pessoa.
- Assuma boas intenções dos demais contribuidores.

## Contato

Dúvidas? Entre em contato com o DEV principal do projeto [Lucas D.](https://github.com/durukar).

---

**Obrigado por contribuir! 🚀**
