import type { Context } from 'hono'
import type { HandlerInterceptor } from '../@winterFramework/interceptor/handler-interceptor'
import { Injectable } from '../@winterFramework/decorator/winter.decorators'

/**
 * Example interceptor — logs every request with timing info.
 * Demonstrates preHandle and postHandle lifecycle.
 */
@Injectable()
export class LoggingInterceptor implements HandlerInterceptor {
    preHandle(ctx: Context): boolean {
        const start = performance.now()
        // Store start time for postHandle
        ctx.set('requestStart', start.toString())
        console.log(`[Interceptor] → ${ctx.req.method} ${ctx.req.url}`)
        return true // always proceed
    }

    postHandle(ctx: Context): void {
        const start = parseFloat(ctx.get('requestStart') || '0')
        const duration = (performance.now() - start).toFixed(2)
        console.log(`[Interceptor] ← ${ctx.req.method} ${ctx.req.url} (${duration}ms)`)
    }
}
