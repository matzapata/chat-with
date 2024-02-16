import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { AuthService } from './services/auth.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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
  async whoami(@CurrentUser() userId: string) {
    console.log('userId: ', userId);
    const user = await this.usersService.findById(userId);
    console.log('user: ', user);
    return { id: user?.id, email: user?.email };
  }

  @Get('/all')
  @UseGuards(AuthGuard)
  async all() {
    return 'all';
  }
}
