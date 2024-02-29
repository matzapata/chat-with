import { Expose, Transform } from 'class-transformer';

export class FileDto {
  @Expose()
  id: string;

  @Expose()
  filename: string;

  @Expose()
  created_at: Date;

  @Transform(({ obj }) => obj.user.id)
  owner: string;
}
