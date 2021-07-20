import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  username: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  @Field((type) => Role, { nullable: true })
  role?: Role;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
    },
  })
  @Field((type) => [Permission], { nullable: 'itemsAndList' })
  permissions?: Permission[];

  @Column()
  @Field(() => Int, { nullable: true })
  role_id?: number;
}
