import type { Context } from 'hono'
import {
    RestController,
    GetMapping,
} from '../@winterFramework/decorator/winter.decorators'
import { UseInterceptor } from '../@winterFramework/decorator/use-interceptor.decorator'
import { Injectable } from '../@winterFramework/decorator/injectable.decorator'
import { Autowired } from '../@winterFramework/decorator/autowired.decorator'
import type { HandlerInterceptor } from '../@winterFramework/interceptor/handler-interceptor'
import { UnauthorizedException } from '../@winterFramework/exceptions/http-exception'

/**
 * Example: Interceptors (@UseInterceptor + HandlerInterceptor)
 *
 * Demonstrates class-level and method-level interceptors for auth,
 * timing, and request logging. Interceptors have preHandle (before)
 * and postHandle (after) lifecycle methods.
 *
 * Test with:
 *   # ❌ No auth header → interceptor throws UnauthorizedException
 *   GET http://localhost:1337/examples/interceptors/dashboard
 *
 *   # ✅ With auth header → passes interceptor
 *   GET http://localhost:1337/examples/interceptors/dashboard -H "Authorization: Bearer token123"
 *
 *   # ✅ Timed route — check console for timing logs
 *   GET http://localhost:1337/examples/interceptors/timed
 */

// --- Auth Interceptor (class-level) ---
@Injectable()
export class AuthInterceptor implements HandlerInterceptor {
    preHandle(ctx: Context): boolean {
        const token = ctx.req.header('Authorization')
        if (!token) {
            throw new UnauthorizedException('Missing Authorization header')
        }
        console.log(`[AuthInterceptor] ✅ Token present: ${token.substring(0, 20)}...`)
        return true
    }
}

// --- Timing Interceptor (method-level) ---
@Injectable()
export class TimingInterceptor implements HandlerInterceptor {
    preHandle(ctx: Context): boolean {
        ctx.set('interceptorStart', performance.now().toString())
        console.log(`[TimingInterceptor] ⏱️ Request started`)
        return true
    }

    postHandle(ctx: Context): void {
        const start = parseFloat(ctx.get('interceptorStart') || '0')
        const duration = (performance.now() - start).toFixed(2)
        console.log(`[TimingInterceptor] ⏱️ Request completed in ${duration}ms`)
    }
}

// --- Controller with interceptors ---
@UseInterceptor(AuthInterceptor)
@RestController('/examples/interceptors')
export class InterceptorExampleController {
    /**
     * Protected by class-level AuthInterceptor.
     * All routes in this controller require Authorization header.
     */
    @GetMapping('/dashboard')
    dashboard(c: Context) {
        return c.json({
            message: 'Welcome to the dashboard!',
            note: 'You passed the AuthInterceptor',
        })
    }

    /**
     * Has both class-level (Auth) AND method-level (Timing) interceptors.
     * Execution order: AuthInterceptor.preHandle → TimingInterceptor.preHandle
     *                  → handler → TimingInterceptor.postHandle
     */
    @GetMapping('/timed')
    @UseInterceptor(TimingInterceptor)
    timedRoute(c: Context) {
        return c.json({
            message: 'This route is auth-protected AND timed',
            interceptors: ['AuthInterceptor (class)', 'TimingInterceptor (method)'],
        })
    }
}
