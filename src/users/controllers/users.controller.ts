import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class UsersController {
  constructor() {}

  @Post('/signup')
  async signup() {
    return 'signup';
  }

  @Post('/signin')
  async signin() {
    return 'signin';
  }

  @Get('/whoami')
  async whoami() {
    return 'whoami';
  }
}
