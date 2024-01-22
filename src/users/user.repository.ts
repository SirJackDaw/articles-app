import { AbstractRepository } from "src/database/abstract.repository";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class UserRepository extends AbstractRepository<User> {
  constructor(@InjectRepository(User) userRepository: Repository<User>) {
    super(userRepository);
  }

  findByEmail(email: string): Promise<User> {
    return this.repository.findOne({ where: { email } });
  }
}