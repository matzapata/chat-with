import { IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  filename: string;

  @IsString()
  query: string;
}
