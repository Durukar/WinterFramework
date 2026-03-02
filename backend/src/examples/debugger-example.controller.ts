import type { Context } from 'hono'
import {
    RestController,
    GetMapping,
    PostMapping,
    PathParam,
    RequestBody,
} from '../@winterFramework/decorator/winter.decorators'
import { DebuggerLogger } from '../@winterFramework/decorator/debugger-logger.decorator'

/**
 * Example: Debug Logging (@DebuggerLogger)
 *
 * Demonstrates how @DebuggerLogger wraps methods with detailed console output
 * including parameters, response data, and execution timing.
 * ⚠️ Only use in development!
 *
 * Test with:
 *   GET  http://localhost:1337/examples/debug
 *   GET  http://localhost:1337/examples/debug/42
 *   POST http://localhost:1337/examples/debug -H "Content-Type: application/json" -d '{"msg":"hello"}'
 *
 * Watch the server console for [DEBUG] output with 🔍📥📤⏱️ icons.
 */
@RestController('/examples/debug')
export class DebugExampleController {
    /**
     * Full debug logging — shows params, return value, and timing.
     */
    @GetMapping()
    @DebuggerLogger({ showParams: true, showReturn: true, showTime: true })
    debugAll(c: Context) {
        return c.json({ message: 'Check your console for full debug output!' })
    }

    /**
     * Timing only — useful for performance monitoring.
     */
    @GetMapping('/:id')
    @DebuggerLogger({ showParams: false, showReturn: false, showTime: true })
    debugTimingOnly(@PathParam('id') id: string, c: Context) {
        return c.json({ message: `Fetched item ${id}`, timing: 'Check console for ⏱️' })
    }

    /**
     * Params + return only — no timing.
     */
    @PostMapping()
    @DebuggerLogger({ showParams: true, showReturn: true, showTime: false })
    debugParamsOnly(@RequestBody() body: Record<string, unknown>, c: Context) {
        return c.json({ message: 'Received data', data: body })
    }
}
