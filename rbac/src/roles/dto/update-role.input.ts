import { CreateRoleInput } from './create-role.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @Field(() => Int)
  id: number;

  @Field()
  name?: string;

  @Field((type) => [Int], { nullable: 'itemsAndList' })
  permissions?: number[];
}
