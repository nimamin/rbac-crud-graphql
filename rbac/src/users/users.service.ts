import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly roleService: RolesService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    let user = await this.userRepository.findOne({
      username: createUserInput.username,
    });

    if (user) {
      throw new HttpException('Item already exists!', HttpStatus.FOUND);
    } else {
      user = new User();
      user.username = createUserInput.username;
      if (createUserInput.role)
        user.role = await this.roleService.findOne(createUserInput.role);
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

  async update(updateUserInput: UpdateUserInput) {
    let user = await this.userRepository.findOne({ id: updateUserInput.id });
    if (!user) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    user.username = updateUserInput.username;
    if (updateUserInput.role)
      user.role = await this.roleService.findOne(updateUserInput.role);
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
