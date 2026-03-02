import type { ConstructorFunction } from '../registry/controller.registry'
import { WinterContainer, type Scope } from '../container/winter-container'

/**
 * Class decorator that registers a class in the Winter DI container.
 * Equivalent to Spring's `@Component` / `@Service` / `@Repository`.
 *
 * @param scope - The DI scope: `'singleton'` (default) or `'transient'`.
 * @returns A class decorator function.
 *
 * @example
 * ```ts
 * @Injectable()
 * export class UserService {
 *   findAll() { return [{ id: 1, name: 'Lucas' }]; }
 * }
 *
 * @Injectable('transient')
 * export class RequestLogger {
 *   log(msg: string) { console.log(msg); }
 * }
 * ```
 */
export function Injectable(scope: Scope = 'singleton') {
    return function <T extends ConstructorFunction>(target: T): T {
        const container = WinterContainer.getInstance()
        container.register(target, scope)
        return target
    }
}
