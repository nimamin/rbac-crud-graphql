import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Permission } from './permissions/entities/permission.entity';

const env = (name, defaultValue ) =>  process.env[name] ? process.env[name] : defaultValue;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env('DATABASE_HOST', 'localhost'),
      port: env('DATABASE_PORT', 5432),
      username: env('DATABASE_USER', 'dev'),
      password: env('DATABASE_PASSWORD', 'secret'),
      database: env('DATABASE_DB', 'rbac'),
      entities: [User, Role, Permission],
      synchronize: true,
      keepConnectionAlive: true,
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
export class AppModule {}
