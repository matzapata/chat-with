import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { SubscriptionPlan, plans } from '../config/plans';
import { UserSubscriptionService } from './user-subscription.service';

// TODO: We can improve this by using redis

@Injectable()
export class PlanCheckerService {
  constructor(
    private readonly userSubscriptionService: UserSubscriptionService,
  ) {}

  async canUploadDocument(user: User, documentsCount: number): Promise<void> {
    const uploadLimit = (await this.checkPlan(user)).limits.max_documents;

    if (uploadLimit === 0) {
      throw new BadRequestException('You have reached your document limit');
    }

    // get documents count
    if (documentsCount >= uploadLimit) {
      throw new BadRequestException('You have reached your document limit');
    }
  }

  async canSendMessage(user: User, messageCount): Promise<void> {
    const messageLimit = (await this.checkPlan(user)).limits.max_messages;

    if (messageLimit === 0) {
      throw new BadRequestException('You have reached your message limit');
    }

    if (messageCount >= messageLimit) {
      throw new BadRequestException('You have reached your message limit');
    }
  }

  private async checkPlan(user: User): Promise<SubscriptionPlan> {
    const userSubscription = await this.userSubscriptionService.findByUserId(
      user.id,
    );
    if (userSubscription?.status === 'active') {
      return Object.values(plans).find(
        (p) => p.variant_id === userSubscription.variant_id,
      );
    } else return Object.values(plans).find((p) => p.variant_id === null);
  }
}
