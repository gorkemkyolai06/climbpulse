import { Module } from '@nestjs/common';
import { WallZonesController } from './wall-zones.controller';
import { WallZonesService } from './wall-zones.service';

@Module({
  controllers: [WallZonesController],
  providers: [WallZonesService],
  exports: [WallZonesService],
})
export class WallZonesModule {}
