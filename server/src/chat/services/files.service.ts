import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/files.entity';
import { User } from 'src/users/entities/user.entity';

export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(owner: User, filename: string): Promise<File> {
    const file = this.fileRepository.create({
      owner: owner,
      filename: filename,
    });
    return this.fileRepository.save(file);
  }

  async delete(id: string) {
    return this.fileRepository.delete(id);
  }

  async findAllByUserId(id: string): Promise<File[]> {
    return this.fileRepository.find({ where: { owner: { id } } });
  }
}
