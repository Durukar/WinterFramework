import type { Context } from 'hono'
import {
    RestController,
    GetMapping,
    PostMapping,
    PathParam,
    RequestBody,
} from '../@winterFramework/decorator/winter.decorators'
import { Autowired } from '../@winterFramework/decorator/autowired.decorator'
import { UserService } from './user.service'
import { NotFoundException, BadRequestException } from '../@winterFramework/exceptions/http-exception'

/**
 * Example controller demonstrating:
 * - @Autowired for DI
 * - Throwing HttpExceptions for centralized handling
 */
@RestController('/users')
export class UserController {
    @Autowired(UserService)
    private service!: UserService

    @GetMapping()
    findAll(c: Context) {
        return c.json(this.service.findAll())
    }

    @GetMapping('/:id')
    findById(@PathParam('id') id: string, c: Context) {
        const user = this.service.findById(parseInt(id))
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`)
        }
        return c.json(user)
    }

    @PostMapping()
    create(@RequestBody() body: { name: string; email: string }, c: Context) {
        if (!body.name || !body.email) {
            throw new BadRequestException('Fields "name" and "email" are required')
        }
        const user = this.service.create(body)
        return c.json(user, 201)
    }
}
