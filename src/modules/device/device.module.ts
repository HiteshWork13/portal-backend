import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { DeviceEntity } from 'src/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity]),
    SharedModule
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule { }
