import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createPermissionInput: CreatePermissionInput) {
    let per = await this.permissionRepository.findOne({
      name: createPermissionInput.name,
    });

    if (!per) {
      per = new Permission();
      per.name = createPermissionInput.name;
      per = await this.permissionRepository.save(per);
    }

    return per;
  }

  findAll() {
    return this.permissionRepository.find();
  }

  findMany(ids: number[]) {
    return this.permissionRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findOne(id: number) {
    let permission = await this.permissionRepository.findOne({ id });
    if (!permission) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return permission;
  }

  async update(updatePermissionInput: UpdatePermissionInput) {
    let permission = await this.permissionRepository.findOne({
      id: updatePermissionInput.id,
    });
    if (!permission) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    permission.name = updatePermissionInput.name;
    return this.permissionRepository.save(permission);
  }

  async remove(id: number) {
    let permission = await this.permissionRepository.findOne({ id });
    if (!permission) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return await this.permissionRepository.remove(permission);
  }

}
