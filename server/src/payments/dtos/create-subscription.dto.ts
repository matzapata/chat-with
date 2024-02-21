import { IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  variant_id: string;
}
