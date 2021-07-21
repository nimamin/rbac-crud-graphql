import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { User } from '../users/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { PermissionsModule } from './permissions.module';
import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([Permission, User])],
      providers: [PermissionsService],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let newItem, length, ids;
  it('should get all permissions array', async () => {
    let permissions = await service.findAll();
    expect(permissions.length).toBeDefined();
    length = permissions.length;
    ids = permissions.map(p => p.id);
  });

  it('should get all permissions by ids', async () => {
    let perms = await service.findMany(ids);
    expect(perms).toBeDefined();
    expect(perms.length).toEqual(length)
    expect(perms.map((p) => p.id)).toEqual(ids);
  });


  it('should create a new permission', async () => {
    newItem = await service.create({ name: 'justfortest' });
    expect(newItem.id).toBeDefined();
    expect(newItem.name).toEqual('justfortest');
  });

  it('should get all permissions with the new one', async () => {
    let permissions = await service.findAll();
    expect(permissions.length).toEqual(length + 1);
  });

  it('should get a single permission', async () => {
    let permission = await service.findOne(newItem.id);
    expect(permission).toEqual(newItem);
  });

  it('should update the new permission', async () => {
    let permission = await service.update({
      id: newItem.id,
      name: 'justfortestedited',
    });
    newItem.name = 'justfortestedited';
    expect(permission).toEqual(newItem);
  });

  it('should get the updated permission', async () => {
    let permission = await service.findOne(newItem.id);
    expect(permission).toEqual(newItem);
  });

  it('should remove the new permission', async () => {
    let remove = await service.remove(newItem.id);
    expect(remove.name).toEqual(newItem.name);
  });

  it('should get an error requesting the removed permission', async () => {
    try {
      let permission = await service.findOne(newItem.id);
    } catch (error) {
      expect(error).toEqual(
        new HttpException('Item does not exist!', HttpStatus.NOT_FOUND),
      );
    }
  });
});
