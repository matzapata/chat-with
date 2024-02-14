import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { SignUpUserDto } from '../dto/signup-user.dto';
import { SignInUserDto } from '../dto/signin-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async signup(@Body() body: SignUpUserDto) {
    return body;
  }

  @Post('/signin')
  async signin(@Body() body: SignInUserDto, @Session() session: any) {
    return { body, session };
  }

  @Post('/signout')
  async signout() {
    return 'signout';
  }

  @Get('/whoami')
  async whoami() {
    return 'whoami';
  }

  @Get('/:uid')
  async getUser() {
    return 'getUser';
  }
}
