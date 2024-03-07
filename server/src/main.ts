import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as jwt from 'jsonwebtoken';

async function bootstrap() {
  // TODO: Remove. dev only
  console.log(
    'Test token: ',
    jwt.sign({ id: '1', email: 'test@test.com' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    }),
  );

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
