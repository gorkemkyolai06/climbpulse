import { Module } from '@nestjs/common';
import { GearInventoryController } from './gear-inventory.controller';
import { GearInventoryService } from './gear-inventory.service';

@Module({
  controllers: [GearInventoryController],
  providers: [GearInventoryService],
  exports: [GearInventoryService],
})
export class GearInventoryModule {}
