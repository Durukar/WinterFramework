import type { Hono } from 'hono'
import { Injectable } from '../decorator/injectable.decorator'

/**
 * A client injectabable utility used in testing to simulate HTTP requests 
 * without binding a real server port. Inspired by Spring's `MockMvc`.
 * 
 * @example
 * ```ts
 * @Autowired(WinterTestClient)
 * private client!: WinterTestClient;
 * 
 * const response = await this.client.get('/users/1');
 * ```
 */
@Injectable()
export class WinterTestClient {
    private app?: Hono

    /**
     * Internal method used by `@WinterTest` to attach the compiled Hono app instance.
     */
    public __attachApp(app: Hono) {
        this.app = app
    }

    private ensureApp(): Hono {
        if (!this.app) {
            throw new Error("WinterTestClient is not attached to an application. Make sure the class is decorated with @WinterTest().")
        }
        return this.app
    }

    /**
     * Performs an HTTP GET request.
     */
    public async get(path: string, headers?: Record<string, string>): Promise<Response> {
        return this.ensureApp().request(path, { method: 'GET', headers })
    }

    /**
     * Performs an HTTP POST request.
     */
    public async post(path: string, body?: any, headers?: Record<string, string>): Promise<Response> {
        return this.ensureApp().request(path, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
            headers: { 'Content-Type': 'application/json', ...headers },
        })
    }

    /**
     * Performs an HTTP PUT request.
     */
    public async put(path: string, body?: any, headers?: Record<string, string>): Promise<Response> {
        return this.ensureApp().request(path, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
            headers: { 'Content-Type': 'application/json', ...headers },
        })
    }

    /**
     * Performs an HTTP DELETE request.
     */
    public async delete(path: string, headers?: Record<string, string>): Promise<Response> {
        return this.ensureApp().request(path, { method: 'DELETE', headers })
    }
}
