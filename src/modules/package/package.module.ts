import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageEntity } from 'src/entities/package.entity';
import { SharedModule } from 'src/shared/shared.module';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PackageEntity]),
    SharedModule
  ],
  controllers: [PackageController],
  providers: [PackageService]
})
export class PackageModule { }
