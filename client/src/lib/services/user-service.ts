import { apiService } from "@/lib/services/api-service"
import { AxiosInstance } from "axios"

interface UserDto {
    email: string;
    name?: string;
}

export class UserService {

    constructor(private readonly client: AxiosInstance) { }

    async get(): Promise<UserDto> {
        const res = await this.client.get('/api/users')
        return res.data
    }

    async updateName(name: string, surname: string): Promise<UserDto> {
        const res = await this.client.put('/api/users', { name: name + ' ' + surname })
        return res.data
    }
}

export const userService = new UserService(apiService.client)