import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;
}
