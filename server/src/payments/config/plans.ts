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

export const plans: { [key: string]: SubscriptionPlan } = {
  free: {
    name: 'Free',
    interval: 'lifetime',
    variant_id: null,
    price: 0,
    description: 'Free plan',
    features: ['1 documents', '100 messages per day'],
    limits: {
      max_documents: 1,
      max_messages: 100,
    },
  },
  pro: {
    name: 'PRO',
    interval: 'month',
    variant_id: '99201',
    price: 4.99,
    description:
      'Access more documents, send more messages and keep boosting your productivity',
    features: ['10 documents per month', '1000 messages per day'],
    limits: {
      max_documents: 10,
      max_messages: 1000,
    },
  },
};
