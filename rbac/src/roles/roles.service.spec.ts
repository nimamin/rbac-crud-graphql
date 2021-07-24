import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { AppModule } from '../app.module';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { PermissionsModule } from '../permissions/permissions.module';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([Role, Permission]),
        PermissionsModule,
      ],
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let newItem, length;
  it('should get all roles array', async () => {
    let roles = await service.findAll();
    expect(roles.length).toBeDefined();
    length = roles.length;
  });

  it('should create a new role', async () => {
    newItem = await service.create({ name: 'justfortest' });
    expect(newItem.id).toBeDefined();
    expect(newItem.name).toEqual('justfortest');
  });

  it('should get all roles with the new one', async () => {
    let roles = await service.findAll();
    expect(roles.length).toEqual(length + 1);
  });

  it('should get a single role', async () => {
    let role = await service.findOne(newItem.id);
    expect(role).toEqual(newItem);
  });

  it('should update the new role', async () => {
    let role = await service.update({
      id: newItem.id,
      name: 'justfortestedited',
    });
    newItem.name = 'justfortestedited';
    expect(role).toEqual(newItem);
  });

  it('should get the updated role', async () => {
    let role = await service.findOne(newItem.id);
    expect(role).toEqual(newItem);
  });

  it('should remove the new role', async () => {
    let remove = await service.remove(newItem.id);
    expect(remove.name).toEqual(newItem.name);
  });

  it('should get an error requesting the removed role', async () => {
    try {
      let role = await service.findOne(newItem.id);
    } catch (error) {
      expect(error).toEqual(
        new HttpException('Item does not exist!', HttpStatus.NOT_FOUND),
      );
    }
  });
});
