import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
  @Field()
  name: string;

  @Field((type) => [Int], { nullable: 'itemsAndList' })
  permissions?: number[];
}
