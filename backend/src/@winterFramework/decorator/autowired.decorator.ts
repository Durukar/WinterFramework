import type { ConstructorFunction } from '../registry/controller.registry'
import { autowiredMetadata } from '../container/winter-container'

/**
 * Property decorator that marks a class property for automatic dependency injection.
 * Equivalent to Spring's `@Autowired` field injection.
 *
 * The dependency is resolved from the Winter DI container when the owning class
 * is instantiated via `container.resolve()`.
 *
 * @param token - The constructor function of the dependency to inject.
 * @returns A property decorator function.
 *
 * @example
 * ```ts
 * @RestController('/users')
 * export class UserController {
 *   @Autowired(UserService)
 *   private service!: UserService;
 *
 *   @GetMapping()
 *   findAll(c: Context) {
 *     return c.json(this.service.findAll());
 *   }
 * }
 * ```
 */
export function Autowired(token: ConstructorFunction) {
    return function (target: object, propertyKey: string) {
        const constructor = target.constructor as ConstructorFunction

        if (!autowiredMetadata.has(constructor)) {
            autowiredMetadata.set(constructor, [])
        }

        autowiredMetadata.get(constructor)!.push({
            propertyKey,
            token,
        })
    }
}
