import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserSubscriptionService } from 'src/payments/services/user-subscription.service';
import { UserDto } from './dto/user-dto';

@Controller('api/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSubscriptionService: UserSubscriptionService,
  ) {}

  @Put('/')
  @Serialize(UserDto)
  async update(@CurrentUser() user: User, @Body() data: UpdateUserDto) {
    const updated = await this.usersService.update(user, data.name);
    return updated;
  }

  @Get('/')
  async get(@CurrentUser() user: User) {
    const userSubscription = await this.userSubscriptionService.find(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      is_pro: userSubscription.plan.variant_id !== null,
      plan: userSubscription.plan,
      subscription: userSubscription.sub,
    };
  }
}
