

import { apiService } from "@/lib/services/api-service"
import { AxiosInstance } from "axios"

interface SubscriptionPlanDto {
    name: string;
    description: string;
    variant_id: string;
    variant_name: string;
    product_id: string;
    product_name: string;
    price: number;
    interval: string;
    interval_count: number;
}

export class PaymentsService {

    constructor(private readonly client: AxiosInstance) { }

    async getAllPlans(): Promise<SubscriptionPlanDto[]> {
        const res = await this.client.get('/api/payments/subscription/plans')
        return res.data
    }

}

export const paymentsService = new PaymentsService(apiService.client)