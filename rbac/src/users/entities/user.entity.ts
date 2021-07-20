import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToOne(() => Role)
  @Field((type) => Role, { nullable: true })
  role?: Role;

  @ManyToMany(() => Permission)
  @Field((type) => [Permission], { nullable: 'itemsAndList' })
  permissions?: Permission[];
}
