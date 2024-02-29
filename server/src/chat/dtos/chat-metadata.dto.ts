import { Expose, Transform } from 'class-transformer';

export class ChatMetadataDto {
  @Expose()
  id: string;

  @Expose()
  filename: string;

  @Expose()
  created_at: Date;

  @Transform(({ obj }) => obj.user.id)
  owner: string;
}