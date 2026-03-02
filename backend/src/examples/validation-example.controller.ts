import type { Context } from 'hono'
import {
    RestController,
    GetMapping,
    PostMapping,
    Validate,
} from '../@winterFramework/decorator/winter.decorators'

/**
 * Example: Schema Validation (@Validate)
 *
 * Demonstrates how to validate request bodies against a schema before
 * the handler executes. Missing fields return a 400 error automatically.
 *
 * Test with:
 *   # ✅ Valid — all required fields present
 *   POST http://localhost:1337/examples/validation/products -H "Content-Type: application/json" \
 *     -d '{"name":"Widget","price":9.99,"category":"tools"}'
 *
 *   # ❌ Invalid — missing "price" field → 400 error
 *   POST http://localhost:1337/examples/validation/products -H "Content-Type: application/json" \
 *     -d '{"name":"Widget"}'
 *
 *   # ❌ Invalid — empty body → 400 error
 *   POST http://localhost:1337/examples/validation/products -H "Content-Type: application/json" -d '{}'
 */
@RestController('/examples/validation')
export class ValidationExampleController {
    /**
     * @Validate checks that all schema keys exist in the request body.
     * If any field is missing, a 400 response is returned automatically.
     * The validated body is available via `c.get('validatedBody')`.
     */
    @PostMapping('/products')
    @Validate({
        name: 'string',
        price: 'number',
        category: 'string',
    })
    createProduct(c: Context) {
        const body = c.get('validatedBody')
        return c.json(
            {
                message: 'Product created successfully',
                product: { id: Date.now(), ...body },
            },
            201,
        )
    }

    /**
     * Schema with more fields — all are required.
     */
    @PostMapping('/orders')
    @Validate({
        customerId: 'number',
        productId: 'number',
        quantity: 'number',
        shippingAddress: 'string',
    })
    createOrder(c: Context) {
        const body = c.get('validatedBody')
        return c.json(
            {
                message: 'Order placed',
                order: { id: Date.now(), status: 'pending', ...body },
            },
            201,
        )
    }
}
