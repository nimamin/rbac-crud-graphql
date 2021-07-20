import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;
}
