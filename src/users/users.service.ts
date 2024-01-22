import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { User } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UserRepository) {}

    async createUser(dto: CreateUserDto) {
        await this.validateRequest(dto)
        dto.password = await bcrypt.hash(dto.password, 10)
        return this.usersRepository.create(dto)
    }

    async getUserById(id: string) {
        return this.usersRepository.findById(id)
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersRepository.findByEmail(email)
        if (!user) throw new BadRequestException('User not found')

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
          throw new UnauthorizedException('Credentials are not valid');
        }

        return user
    }

    private async validateRequest(dto: CreateUserDto) {
        const { email } = dto
        const userExists = await this.usersRepository.findByEmail(email)
        if (userExists) throw new BadRequestException('Email already exists')
    }
}
