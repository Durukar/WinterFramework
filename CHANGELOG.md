# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Updated `hono` from ^4.7.2 to ^4.12.3 (includes security fixes in v4.12.0)
- Updated `@hono/node-server` from ^1.13.8 to ^1.19.9
- Updated `drizzle-orm` from ^0.40.0 to ^0.45.1
- Updated `@types/node` from ^20.11.17 to ^22.13.0

### Added

- Dependency Injection (DI) Container with `@Injectable()` and `@Autowired()` decorators
- Global Exception Handling with `@ControllerAdvice()` and `@ExceptionHandler()` decorators
- Request Pipeline Interceptors with `HandlerInterceptor` interface and `@UseInterceptor()` decorator
- Core HTTP Exceptions hierarchy (`NotFoundException`, `BadRequestException`, etc.)
- JSDoc documentation for all framework core files and decorators
- `CHANGELOG.md` following Keep a Changelog format
- Improved contribution guides (EN/PT-BR) with PR templates, commit conventions, and Code of Conduct
- Professional README with badges, architecture overview, and bilingual support

### Removed

- Unused React-related ESLint plugins (`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`)

### Fixed

- TypeScript strict mode error in `debugger-logger.decorator.ts` (`err` is `unknown` type)
