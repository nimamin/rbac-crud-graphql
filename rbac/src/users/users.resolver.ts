import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { User } from './models/user.model';

@Resolver((of) => User)
export class UsersResolver {
  constructor() {}

  @Query((returns) => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    return { id: 1, username: 'nima' };
  }

  @Query((returns) => [User])
  async users() {
    return [{ id: 1, username: 'nima' }, {id:2, username: "mamad"}];
  }
}
