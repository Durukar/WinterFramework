import { Injectable } from '../@winterFramework/decorator/winter.decorators'

/**
 * Example service demonstrating @Injectable DI.
 * In a real app, this would use @ServiceRepo to access the database.
 */
@Injectable()
export class UserService {
    private users = [
        { id: 1, name: 'Lucas D.', email: 'lucas@winter.dev' },
        { id: 2, name: 'Winter User', email: 'user@winter.dev' },
    ]

    findAll() {
        return this.users
    }

    findById(id: number) {
        return this.users.find((u) => u.id === id) || null
    }

    create(data: { name: string; email: string }) {
        const newUser = { id: this.users.length + 1, ...data }
        this.users.push(newUser)
        return newUser
    }
}
