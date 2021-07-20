import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(username: string) {
    let user = await this.userRepository.findOne({ username });

    if (!user) {
      user = new User();
      user.username = username;
      user = await this.userRepository.save(user);
    }

    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    let user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, username: string) {
    let user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    user.username = username;
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    let user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.remove(user);
  }
}
