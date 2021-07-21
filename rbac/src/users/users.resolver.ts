import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { RolesService } from '../roles/roles.service';
import { PermissionsService } from '../permissions/permissions.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly permissionService: PermissionsService,
  ) {}

  @Mutation(() => User)
  createUser(
    @Args('username') username: string,
    @Args('role', { type: () => Int, nullable: true }) role: number,
    @Args('permissions', { type: () => [Int], nullable: true })
    permissions: number[],
  ) {
    return this.usersService.create(username, role, permissions);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('username') username: string,
    @Args('role', { type: () => Int, nullable: true }) role: number,
    @Args('permissions', { type: () => [Int], nullable: true })
    permissions: number[],
  ) {
    return this.usersService.update(id, username, role, permissions);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @ResolveField()
  async role(@Parent() user: User) {
    return this.rolesService.findOne(user.role_id);
  }

  @ResolveField()
  async permissions(@Parent() user: User) {
    return this.permissionService.getUserPermissions(user.id);
  }
}
