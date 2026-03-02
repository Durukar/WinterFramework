import { expect } from 'bun:test'
import { WinterTest, MockBean, Test, WinterTestClient } from '../@winterFramework/testing'
import { Autowired } from '../@winterFramework/decorator/autowired.decorator'
import { UserController } from '../examples/user.controller'
import { UserService } from '../examples/user.service'

@WinterTest({
    controllers: [UserController],
    providers: [UserService]
})
export class UserControllerTest {

    @MockBean(UserService)
    private mockUserService!: UserService

    @Autowired(WinterTestClient)
    private client!: WinterTestClient

    @Test('GET /users should return mocked data from injected UserService via Class-Based Test')
    async testFindAllUsers() {
        this.mockUserService.findAll = () => [
            { id: 999, name: 'System Mocked User', email: 'mock@system.com' }
        ]

        const res = await this.client.get('/users')
        expect(res.status).toBe(200)

        const body = await res.json()
        expect(body).toEqual([{ id: 999, name: 'System Mocked User', email: 'mock@system.com' }])
    }

    @Test('GET /users/:id should return mocked data for specific ID')
    async testFindById() {
        this.mockUserService.findById = (id: number) => ({
            id,
            name: 'Mocked User By ID',
            email: `user${id}@system.com`
        })

        const res = await this.client.get('/users/42')
        expect(res.status).toBe(200)

        const body = await res.json()
        expect(body).toEqual({ id: 42, name: 'Mocked User By ID', email: 'user42@system.com' })
    }
}
