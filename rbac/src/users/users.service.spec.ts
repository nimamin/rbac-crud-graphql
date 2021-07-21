import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { Permission } from '../permissions/entities/permission.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([User, Permission]),
        RolesModule,
        PermissionsModule,
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let newItem, length;
  it('should get all users array', async () => {
    let users = await service.findAll();
    expect(users.length).toBeDefined();
    length = users.length;
  });

  it('should create a new user', async () => {
    newItem = await service.create({ username: 'justfortest' });
    expect(newItem.id).toBeDefined();
    expect(newItem.username).toEqual('justfortest');
  });

  it('should get all users with the new one', async () => {
    let users = await service.findAll();
    expect(users.length).toEqual(length + 1);
  });

  it('should get a single user', async () => {
    let user = await service.findOne(newItem.id);
    expect(user).toEqual(newItem);
  });

  it('should update the new user', async () => {
    let user = await service.update({
      id: newItem.id,
      username: 'justfortestedited',
    });
    newItem.username = 'justfortestedited';
    expect(user).toEqual(newItem);
  });

  it('should get the updated user', async () => {
    let user = await service.findOne(newItem.id);
    expect(user).toEqual(newItem);
  });

  it('should remove the new user', async () => {
    let remove = await service.remove(newItem.id);
    expect(remove.username).toEqual(newItem.username);
  });

  it('should get an error requesting the removed user', async () => {
    try {
      let user = await service.findOne(newItem.id);
    } catch (error) {
      expect(error).toEqual(
        new HttpException('Item does not exist!', HttpStatus.NOT_FOUND),
      );
    }
  });
});
