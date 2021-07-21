import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field((type) => Int, { nullable: true })
  role?: number;

  @Field((type) => [Int], { nullable: 'itemsAndList' })
  permissions?: number[];
}
