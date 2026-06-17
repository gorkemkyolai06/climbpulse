import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ClimbingGymService } from './climbing-gym.service';
import { UpdateClimbingGymDto } from './dto/update-climbing-gym.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('climbing-gym')
@UseGuards(JwtAuthGuard)
export class ClimbingGymController {
  constructor(private climbingGymService: ClimbingGymService) {}

  @Get()
  get(@Request() req: { user: { climbingGymId: string } }) {
    return this.climbingGymService.get(req.user.climbingGymId);
  }

  @Patch()
  update(
    @Request() req: { user: { climbingGymId: string } },
    @Body() dto: UpdateClimbingGymDto,
  ) {
    return this.climbingGymService.update(req.user.climbingGymId, dto);
  }
}
