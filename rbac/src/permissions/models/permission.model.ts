import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;
}
