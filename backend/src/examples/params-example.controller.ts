import type { Context } from 'hono'
import {
    RestController,
    GetMapping,
    PostMapping,
    PutMapping,
    PathParam,
    QueryParam,
    RequestBody,
} from '../@winterFramework/decorator/winter.decorators'

/**
 * Example: Parameter Injection (@PathParam, @QueryParam, @RequestBody)
 *
 * Demonstrates how Winter injects request data directly into method parameters,
 * equivalent to Spring's @PathVariable, @RequestParam, and @RequestBody.
 *
 * Test with:
 *   GET  http://localhost:1337/examples/params/42
 *   GET  http://localhost:1337/examples/params/search?q=winter&limit=5
 *   POST http://localhost:1337/examples/params -H "Content-Type: application/json" -d '{"title":"Hello","content":"World"}'
 *   PUT  http://localhost:1337/examples/params/1 -H "Content-Type: application/json" -d '{"title":"Updated"}'
 */
@RestController('/examples/params')
export class ParamExampleController {
    /**
     * @PathParam — extracts `:id` from the URL path.
     * Equivalent to Spring's @PathVariable.
     */
    @GetMapping('/:id')
    getById(@PathParam('id') id: string, c: Context) {
        return c.json({
            message: `Fetched resource with id: ${id}`,
            paramType: 'PathParam',
        })
    }

    /**
     * @QueryParam — extracts query string parameters.
     * Equivalent to Spring's @RequestParam.
     */
    @GetMapping('/search')
    search(
        @QueryParam('q') query: string,
        @QueryParam('limit') limit: string,
        c: Context,
    ) {
        return c.json({
            message: `Searching for: "${query}" with limit: ${limit || '10'}`,
            paramType: 'QueryParam',
            params: { q: query, limit: limit || '10' },
        })
    }

    /**
     * @RequestBody — parses the JSON request body and injects it.
     * Equivalent to Spring's @RequestBody.
     */
    @PostMapping()
    create(@RequestBody() body: { title: string; content: string }, c: Context) {
        return c.json({
            message: 'Resource created',
            paramType: 'RequestBody',
            data: body,
        }, 201)
    }

    /**
     * Combining @PathParam + @RequestBody in a single method.
     */
    @PutMapping('/:id')
    update(
        @PathParam('id') id: string,
        @RequestBody() body: { title?: string },
        c: Context,
    ) {
        return c.json({
            message: `Updated resource ${id}`,
            paramTypes: ['PathParam', 'RequestBody'],
            data: { id, ...body },
        })
    }
}
