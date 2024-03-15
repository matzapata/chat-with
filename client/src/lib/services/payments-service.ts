

import { apiService } from "@/lib/services/api-service"
import { AxiosInstance } from "axios"

export interface SubscriptionPlan {
    name: string;
    variant_id: string | null;
    interval: 'month' | 'year' | 'lifetime';
    price: number;
    description: string;
    features: string[];
    limits: {
        max_documents: number;
        max_messages: number;
    };
}
export enum SubscriptionPlanKey {
    FREE = "free",
    PRO = "pro"
}

export class PaymentsService {

    constructor(private readonly client: AxiosInstance) { }

    async getPlans(): Promise<Record<SubscriptionPlanKey, SubscriptionPlan>> {
        const res = await this.client.get('/api/payments/plans')
        return res.data
    }

    async createCheckout(variant_id: string): Promise<string> {
        const res = await this.client.post('/api/payments/subscription', { variant_id })
        return res.data.url
    }

    async getSubscription(): Promise<any> {
        const res = await this.client.get('/api/payments/subscription')
        return res.data.subscription
    }

    async createPortal(): Promise<string> {
        const res = await this.client.get('/api/payments/subscription/portal')
        return res.data.url
    }
}

export const paymentsService = new PaymentsService(apiService.client)