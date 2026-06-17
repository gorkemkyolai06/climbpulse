import { Module } from '@nestjs/common';
import { RouteSettingsController } from './route-settings.controller';
import { RouteSettingsService } from './route-settings.service';

@Module({
  controllers: [RouteSettingsController],
  providers: [RouteSettingsService],
  exports: [RouteSettingsService],
})
export class RouteSettingsModule {}
