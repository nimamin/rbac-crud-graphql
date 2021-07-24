import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { Repository } from 'typeorm';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private readonly permissionService: PermissionsService,
  ) {}

  async create(createRoleInput: CreateRoleInput) {
    let role = await this.roleRepository.findOne({
      name: createRoleInput.name,
    });

    if (!role) {
      role = new Role();
      role.name = createRoleInput.name;
      if (createRoleInput.permissions)
        role.permissions = await this.permissionService.findMany(
          createRoleInput.permissions,
        );
      role = await this.roleRepository.save(role);
    }

    return role;
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: number) {
    let role = await this.roleRepository.findOne({ id });
    if (!role) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async update(updateRoleInput: UpdateRoleInput) {
    let role = await this.roleRepository.findOne({ id: updateRoleInput.id });
    if (!role) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    role.name = updateRoleInput.name;
    if (updateRoleInput.permissions)
      role.permissions = await this.permissionService.findMany(
        updateRoleInput.permissions,
      );
    return this.roleRepository.save(role);
  }

  async remove(id: number) {
    let role = await this.roleRepository.findOne({ id });
    if (!role) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return await this.roleRepository.remove(role);
  }

  async getRolePermissions(id: number) {
    let user = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    return user.permissions;
  }
}
