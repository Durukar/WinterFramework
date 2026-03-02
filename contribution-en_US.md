# 🤝 Contributing Guide

Welcome to **WinterFramework**! We appreciate your interest in contributing. This guide explains how you can help improve the project.

## Table of Contents

- [How to Contribute](#how-to-contribute)
- [Environment Setup](#environment-setup)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Guidelines](#code-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Code of Conduct](#code-of-conduct)
- [Contact](#contact)

## How to Contribute

1. **Fork the Repository** — Fork this repository to your GitHub account.
2. **Clone the Repository** — Clone your fork to your local machine:
   ```bash
   git clone https://github.com/<your-username>/WinterFramework.git
   ```
3. **Create a Branch** — Create a branch following the [naming convention](#branch-naming-convention):
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make Your Changes** — Implement your changes in the code.
5. **Test** — Ensure your changes work and do not break existing functionality.
6. **Commit** — Follow the [commit convention](#commit-convention).
7. **Push** — Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Pull Request** — Open a PR following the [PR process](#pull-request-process).

## Environment Setup

### Requirements
- **Bun** (latest)
- **Node.js** LTS 22 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/durukar/WinterFramework.git

# 2. Navigate to the backend folder
cd WinterFramework/backend

# 3. Install dependencies
bun install

# 4. Copy and configure environment variables
cp .env.example .env

# 5. Run the project
bun start
```

## Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| New feature | `feature/<description>` | `feature/add-cors-support` |
| Bug fix | `bugfix/<description>` | `bugfix/fix-param-injection` |
| Documentation | `docs/<description>` | `docs/update-readme` |
| Refactoring | `refactor/<description>` | `refactor/simplify-registry` |

## Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(decorator): add @Header decorator for response headers
fix(validator): handle undefined body gracefully
docs(readme): add database configuration section
```

## Pull Request Process

1. **Title and description** must be written in both **Portuguese** and **English**.
2. Fill out the PR template below.
3. Ensure all existing functionality still works.
4. Request review from at least one maintainer.

### PR Template

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

## Code Guidelines

- Follow the existing code style and conventions.
- Use **TypeScript** with strict mode enabled.
- Document your code with **JSDoc** comments, especially for complex logic.
- Use the existing decorator pattern when adding new framework features.
- Keep imports organized (simple-import-sort is configured).

## Reporting Bugs

If you find a bug, open an issue with:

- **Problem description** — What happened?
- **Steps to reproduce** — How can we reproduce the issue?
- **Expected vs. observed behavior** — What did you expect to happen?
- **Environment** — OS, Node.js version, Bun version.

## Code of Conduct

- Be respectful and constructive in all interactions.
- Welcome newcomers and help them get started.
- Focus on the problem, not the person.
- Assume good intentions from fellow contributors.

## Contact

Questions? Reach out to the project's main developer [Lucas D.](https://github.com/durukar).

---

**Thank you for contributing! 🚀**
