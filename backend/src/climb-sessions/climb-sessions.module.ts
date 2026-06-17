import { Module } from '@nestjs/common';
import { ClimbSessionsController } from './climb-sessions.controller';
import { ClimbSessionsService } from './climb-sessions.service';

@Module({
  controllers: [ClimbSessionsController],
  providers: [ClimbSessionsService],
  exports: [ClimbSessionsService],
})
export class ClimbSessionsModule {}
