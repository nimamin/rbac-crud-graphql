import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async create(name: string) {
    let per = await this.permissionRepository.findOne({ name });

    if (!per) {
      per = new Permission();
      per.name = name;
      per = await this.permissionRepository.save(per);
    }

    return per;
  }

  findAll() {
    return this.permissionRepository.find();
  }

  async findOne(id: number) {
    let permission = await this.permissionRepository.findOne({ id });
    if (!permission) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return permission;
  }

  async update(id: number, name: string) {
    let permission = await this.permissionRepository.findOne({ id });
    if (!permission) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    permission.name = name;
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
