import { Repository } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id): Promise<T> {
    return this.repository.findOne({ where: { id }});
  }

  //TODO: something with type overriding in TypeORM
  async create(data: any): Promise<T> {
    const entity = this.repository.create(data as T);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<unknown>): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id): Promise<void> {
    await this.repository.delete(id);
  }
}
