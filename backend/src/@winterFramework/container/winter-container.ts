import type { ConstructorFunction } from '../registry/controller.registry'

/**
 * Supported dependency injection scopes.
 * - `singleton` — One shared instance per container (default).
 * - `transient` — A new instance is created on every resolution.
 */
export type Scope = 'singleton' | 'transient'

/**
 * Metadata stored in the DI container for each registered provider.
 */
interface ProviderEntry {
    /** The constructor function to instantiate. */
    constructor: ConstructorFunction
    /** The DI scope for this provider. */
    scope: Scope
    /** Cached singleton instance (only for `'singleton'` scope). */
    instance?: object
}

/**
 * Metadata describing a property marked for dependency injection via {@link Autowired}.
 */
export interface AutowiredMetadata {
    /** The name of the property on the target class. */
    propertyKey: string
    /** The constructor (token) of the dependency to inject. */
    token: ConstructorFunction
}

/** Global registry: class → list of properties decorated with `@Autowired`. */
export const autowiredMetadata: Map<ConstructorFunction, AutowiredMetadata[]> = new Map()

/**
 * Lightweight IoC container for Winter Framework — inspired by Spring's ApplicationContext.
 *
 * Manages the lifecycle of injectable services, resolves dependency graphs
 * via `@Autowired` property metadata, and caches singleton instances.
 *
 * @example
 * ```ts
 * const container = WinterContainer.getInstance()
 * container.register(UserService)
 * const svc = container.resolve(UserService)
 * ```
 */
export class WinterContainer {
    private static instance: WinterContainer
    private providers: Map<ConstructorFunction, ProviderEntry> = new Map()

    private constructor() { }

    /**
     * Returns the global singleton container instance.
     */
    public static getInstance(): WinterContainer {
        if (!WinterContainer.instance) {
            WinterContainer.instance = new WinterContainer()
        }
        return WinterContainer.instance
    }

    /**
     * Registers a constructor in the container with the given scope.
     * @param token - The constructor function to register.
     * @param scope - The DI scope (default: `'singleton'`).
     */
    public register(token: ConstructorFunction, scope: Scope = 'singleton'): void {
        if (!this.providers.has(token)) {
            this.providers.set(token, { constructor: token, scope })
        }
    }

    /**
     * Resolves an instance of the given token, injecting all `@Autowired` dependencies recursively.
     * @param token - The constructor function to resolve.
     * @returns The resolved instance with all dependencies injected.
     */
    public resolve<T extends object>(token: ConstructorFunction): T {
        const entry = this.providers.get(token)

        if (!entry) {
            // Auto-register if not found (e.g. controllers not explicitly registered)
            this.register(token)
            return this.resolve<T>(token)
        }

        // Return cached singleton if available
        if (entry.scope === 'singleton' && entry.instance) {
            return entry.instance as T
        }

        // Create new instance
        const instance = new entry.constructor() as Record<string, unknown>

        // Inject @Autowired dependencies
        const metadata = autowiredMetadata.get(token)
        if (metadata) {
            for (const dep of metadata) {
                instance[dep.propertyKey] = this.resolve(dep.token)
            }
        }

        // Cache singleton
        if (entry.scope === 'singleton') {
            entry.instance = instance as object
        }

        return instance as T
    }

    /**
     * Overrides a registered provider with a custom instance (useful for mocking in tests).
     * @param token - The constructor function to override.
     * @param mockInstance - The instance to use instead of creating a new one.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public overrideProvider(token: ConstructorFunction, mockInstance: any): void {
        this.providers.set(token, {
            constructor: token,
            scope: 'singleton',
            instance: mockInstance as object
        })
    }

    /**
     * Checks if a token is registered in the container.
     * @param token - The constructor function to check.
     */
    public has(token: ConstructorFunction): boolean {
        return this.providers.has(token)
    }

    /**
     * Clears all registrations and cached instances. Useful for testing.
     */
    public clear(): void {
        this.providers.clear()
    }
}
