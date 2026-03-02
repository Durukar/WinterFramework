import type { Context } from 'hono'
import {
    RestController,
    GetMapping,
    UseMiddleware,
} from '../@winterFramework/decorator/winter.decorators'

/**
 * Example: Per-Method Middleware (@UseMiddleware)
 *
 * Demonstrates how to apply middleware to specific controller methods.
 * Middleware runs before the handler and can short-circuit the request.
 *
 * Test with:
 *   # ✅ Public — no auth required
 *   GET http://localhost:1337/examples/middleware/public
 *
 *   # ❌ Protected without token → 401
 *   GET http://localhost:1337/examples/middleware/protected
 *
 *   # ✅ Protected with token → 200
 *   GET http://localhost:1337/examples/middleware/protected -H "Authorization: Bearer my-token"
 *
 *   # ✅ Timed — logs execution time in console
 *   GET http://localhost:1337/examples/middleware/timed
 */
@RestController('/examples/middleware')
export class MiddlewareExampleController {
    /**
     * Public endpoint — no middleware.
     */
    @GetMapping('/public')
    publicEndpoint(c: Context) {
        return c.json({ message: 'This is public, no middleware applied' })
    }

    /**
     * Protected endpoint — auth middleware checks for Authorization header.
     * If missing, returns 401 without reaching the handler.
     */
    @GetMapping('/protected')
    @UseMiddleware(async (ctx, next) => {
        const token = ctx.req.header('Authorization')
        if (!token) {
            return ctx.json({ error: 'Unauthorized — missing Authorization header' }, 401)
        }
        console.log(`[Middleware] Auth token: ${token}`)
        await next()
    })
    protectedEndpoint(c: Context) {
        return c.json({ message: 'Access granted! You are authenticated.' })
    }

    /**
     * Timed endpoint — middleware measures and logs execution time.
     */
    @GetMapping('/timed')
    @UseMiddleware(async (ctx, next) => {
        const start = performance.now()
        await next()
        const duration = (performance.now() - start).toFixed(2)
        console.log(`[Middleware] /timed executed in ${duration}ms`)
    })
    timedEndpoint(c: Context) {
        return c.json({
            message: 'This response was timed by middleware',
            timestamp: new Date().toISOString(),
        })
    }
}
