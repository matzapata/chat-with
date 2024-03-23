import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/entities/users/user.entity';
import { UserSubscriptionService } from './user-subscription.service';

// TODO: We can improve this by using redis

@Injectable()
export class PlanCheckerService {
  constructor(
    private readonly userSubscriptionService: UserSubscriptionService,
  ) {}

  async canUploadDocument(user: User, documentsCount: number): Promise<void> {
    const { plan } = await this.userSubscriptionService.find(user);
    const uploadLimit = plan.limits.max_documents;

    if (uploadLimit === 0) {
      throw new BadRequestException('You have reached your document limit');
    }

    // get documents count
    if (documentsCount >= uploadLimit) {
      throw new BadRequestException('You have reached your document limit');
    }
  }

  async canSendMessage(user: User, messageCount): Promise<void> {
    const { plan } = await this.userSubscriptionService.find(user);
    const messageLimit = plan.limits.max_messages;

    if (messageLimit === 0) {
      throw new BadRequestException('You have reached your message limit');
    }

    if (messageCount >= messageLimit) {
      throw new BadRequestException('You have reached your message limit');
    }
  }
}
