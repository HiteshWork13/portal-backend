import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { SharedModule } from 'src/shared/shared.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    SharedModule
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
