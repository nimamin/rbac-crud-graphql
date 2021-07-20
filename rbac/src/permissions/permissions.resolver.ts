import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';

@Resolver(() => Permission)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Mutation(() => Permission)
  createPermission(@Args('name') name: string) {
    return this.permissionsService.create(name);
  }

  @Query(() => [Permission], { name: 'permissions' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Query(() => Permission, { name: 'permission' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.permissionsService.findOne(id);
  }

  @Mutation(() => Permission)
  updatePermission(
    @Args('id', { type: () => Int }) id: number,
    @Args('name') name: string,
  ) {
    return this.permissionsService.update(id, name);
  }

  @Mutation(() => Permission)
  removePermission(@Args('id', { type: () => Int }) id: number) {
    return this.permissionsService.remove(id);
  }
}
