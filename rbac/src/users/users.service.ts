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

  async create(username: string, roleId?: number, permissions?: number[]) {
    let user = await this.userRepository.findOne({ username });

    if (user) {
      throw new HttpException('Item already exists!', HttpStatus.FOUND);
    } else {
      user = new User();
      user.username = username;
      if (roleId) user.role_id = roleId;
      if (permissions)
        user.permissions = await this.permissionService.findMany(permissions);
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

  async update(
    id: number,
    username?: string,
    roleId?: number,
    permissions?: number[],
  ) {
    let user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    user.username = username;
    if (roleId) user.role_id = roleId;
    if (permissions)
      user.permissions = await this.permissionService.findMany(permissions);
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
