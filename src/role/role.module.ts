import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  exports: [TypeOrmModule],
})
export class RoleModule {}
