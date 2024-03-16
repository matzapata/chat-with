import { apiService } from "@/lib/services/api-service"
import { AxiosInstance } from "axios"
import { SubscriptionPlan } from "./payments-service";

interface UserDto {
    id: string;
    email: string;
    name?: string;
    is_pro: boolean;
    plan: SubscriptionPlan;
    subscription: {} | null; // TODO: define subscription type
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