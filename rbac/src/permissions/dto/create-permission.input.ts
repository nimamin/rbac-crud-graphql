import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePermissionInput {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
