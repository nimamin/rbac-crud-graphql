import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(name: string) {
    let role = await this.roleRepository.findOne({ name });

    if (!role) {
      role = new Role();
      role.name = name;
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

  async update(id: number, name: string) {
    let role = await this.roleRepository.findOne({ id });
    if (!role) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    role.name = name;
    return this.roleRepository.save(role)
  }

  async remove(id: number) {
    let role = await this.roleRepository.findOne({ id });
    if (!role) {
      throw new HttpException('Item does not exist!', HttpStatus.NOT_FOUND);
    }
    return await this.roleRepository.remove(role)
  }
}
