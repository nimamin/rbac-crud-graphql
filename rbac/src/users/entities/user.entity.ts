import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field(type => Role)
  role?: Role;

  @Field(type => [Permission])
  permissions?: Permission[];
}
