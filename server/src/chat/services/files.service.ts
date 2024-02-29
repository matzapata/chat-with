import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/files.entity';
import { User } from 'src/users/entities/user.entity';

export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(
    owner: User,
    filename: string,
    embeddings_ids: string[],
  ): Promise<File> {
    const file = this.fileRepository.create({
      owner: owner,
      filename: filename,
      embeddings_ids: embeddings_ids,
    });
    return this.fileRepository.save(file);
  }

  async delete(id: string) {
    return this.fileRepository.delete(id);
  }

  async findAllOwnedBy(owner: User): Promise<File[]> {
    return this.fileRepository.find({ where: { owner } });
  }

  async findById(id: string): Promise<File | null> {
    return this.fileRepository.findOne({ where: { id } });
  }
}
