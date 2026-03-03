import { Hono } from 'hono'
import { registerControllers } from '../app/register-controllers.app'
import { WinterContainer } from '../container/winter-container'
import type { ConstructorFunction } from '../registry/controller.registry'
import { globalInterceptors } from '../registry/interceptor.registry'

/**
 * A specialized builder for creating a Winter application context in a testing environment.
 * Unlike the standard `Winter` builder, `WinterTestBuilder` does not start a real HTTP server.
 * Instead, it returns the underlying `Hono` app instance so you can simulate requests using `app.request()`.
 * 
 * It also provides methods like `overrideProvider` to inject mock dependencies.
 */
export class WinterTestBuilder {
    private app: Hono = new Hono()
    private controllers: ConstructorFunction[] = []
    private middlewares: Array<(app: Hono) => void> = []
    private advices: ConstructorFunction[] = []

    /**
     * Registers controller classes for testing.
     */
    public addController(...controllers: ConstructorFunction[]): WinterTestBuilder {
        this.controllers.push(...controllers)
        return this
    }

    /**
     * Registers real providers in the DI container.
     */
    public addProvider(...providers: ConstructorFunction[]): WinterTestBuilder {
        const container = WinterContainer.getInstance()
        providers.forEach((provider) => container.register(provider))
        return this
    }

    /**
     * Overrides a provider with a mock instance.
     * Useful for mocking out database connections or external services.
     * 
     * @param token - The class/constructor to override.
     * @param mockInstance - The mock object to inject.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public overrideProvider(token: ConstructorFunction, mockInstance: any): WinterTestBuilder {
        WinterContainer.getInstance().overrideProvider(token, mockInstance)
        return this
    }

    /**
     * Registers global exception handlers for testing.
     */
    public addControllerAdvice(...advices: ConstructorFunction[]): WinterTestBuilder {
        this.advices.push(...advices)
        return this
    }

    /**
     * Registers a global interceptor for testing.
     */
    public addInterceptor(interceptor: ConstructorFunction): WinterTestBuilder {
        globalInterceptors.push(interceptor)
        return this
    }

    /**
     * Registers a global middleware function for testing.
     */
    public addMiddleware(middleware: (app: Hono) => void): WinterTestBuilder {
        this.middlewares.push(middleware)
        return this
    }

    /**
     * Bootstraps the test application and returns the Hono instance.
     * Does NOT call `serve()` to open a port.
     */
    public start(): Hono {
        this.middlewares.forEach((middleware) => middleware(this.app))

        // Instantiate @ControllerAdvice classes
        this.advices.forEach((advice) => new advice())

        // Register controllers
        registerControllers(this.app, this.controllers)

        return this.app
    }

    /**
     * Factory method — creates a new Winter test context.
     * It also clears the DI container to ensure a clean slate between tests.
     */
    public static create(): WinterTestBuilder {
        WinterContainer.getInstance().clear()
        return new WinterTestBuilder()
    }
}
