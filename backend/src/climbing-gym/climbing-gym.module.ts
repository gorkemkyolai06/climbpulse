import { Module } from '@nestjs/common';
import { ClimbingGymController } from './climbing-gym.controller';
import { ClimbingGymService } from './climbing-gym.service';

@Module({
  controllers: [ClimbingGymController],
  providers: [ClimbingGymService],
  exports: [ClimbingGymService],
})
export class ClimbingGymModule {}
