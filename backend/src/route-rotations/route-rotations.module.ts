import { Module } from '@nestjs/common';
import { RouteRotationsController } from './route-rotations.controller';
import { RouteRotationsService } from './route-rotations.service';

@Module({
  controllers: [RouteRotationsController],
  providers: [RouteRotationsService],
  exports: [RouteRotationsService],
})
export class RouteRotationsModule {}
