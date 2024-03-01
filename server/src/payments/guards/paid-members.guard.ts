import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '../entities/subscription-user.entity';

@Injectable()
export class PaidMemberGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    // requires a the current user middleware to be run first
    return (
      !!req.currentUser &&
      req.currentUser.subscription?.status === SubscriptionStatus.active
    );
  }
}
