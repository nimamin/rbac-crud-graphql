import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Permission } from 'src/permissions/models/permission.model';
import { Role } from 'src/roles/models/role.model';

@ObjectType()
export class User {
  @Field(type => Int)
  id: number;

  @Field()
  username: string;

  @Field(type => [Role], { nullable: true })
  role: Role[];
  
  @Field(type => [Permission], { nullable: 'itemsAndList' })
  permissions: Permission[];
}
