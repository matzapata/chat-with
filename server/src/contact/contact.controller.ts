import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailService } from 'src/infrastructure/emails/email.service';
import { CreateContactDto } from './dtos/contact-dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/entities/users/user.entity';

@Controller('api/contact')
@UseGuards(AuthGuard)
export class ContactController {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/')
  async create(
    @CurrentUser() user: User,
    @Body() createContactDto: CreateContactDto,
  ) {
    const { message, subject } = createContactDto;
    await this.emailService.sendEmail({
      to: this.configService.get('CONTACT_EMAIL'),
      subject: `New contact request from ${user.email}`,
      text: `Email: ${user.email}\nUID: ${user.id}\nSubject:${subject}\n\nMessage: ${message}`,
    });
    return 'OK';
  }
}
