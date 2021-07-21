import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly permissionService: PermissionsService,
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
      if (createUserInput.role) user.role_id = createUserInput.role;
      if (createUserInput.permissions)
        user.permissions = await this.permissionService.findMany(
          createUserInput.permissions,
        );
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
    if (updateUserInput.role) user.role_id = updateUserInput.role;
    if (updateUserInput.permissions)
      user.permissions = await this.permissionService.findMany(
        updateUserInput.permissions,
      );
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    let user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.remove(user);
  }

  async getUserPermissions(userId: number) {
    let user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });
    return user.permissions;
  }
}
