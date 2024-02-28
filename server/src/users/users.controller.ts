import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { AuthService } from './services/auth.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { User } from './entities/user.entity';

@Controller('api/users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: SignUpUserDto) {
    const user = await this.authService.signup(body.email, body.password);
    return { id: user.id, email: user.email };
  }

  @Post('/signin')
  async signin(@Body() body: SignInUserDto) {
    const { user, token } = await this.authService.signin(
      body.email,
      body.password,
    );

    return { id: user.id, email: user.email, token };
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoami(@CurrentUser() user: User) {
    return {
      id: user?.id,
      email: user?.email,
      subscription: user?.subscription,
    };
  }
}
