import { IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  file_name: string;

  @IsString()
  query: string;
}
