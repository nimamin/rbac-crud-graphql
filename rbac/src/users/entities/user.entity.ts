import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  role_id?: number;
}
