import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { ClimbSessionsService } from './climb-sessions.service';
import { CreateClimbSessionDto, UpdateClimbSessionDto } from './dto/climb-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('climb-sessions')
@UseGuards(JwtAuthGuard)
export class ClimbSessionsController {
  constructor(private climbSessionsService: ClimbSessionsService) {}

  @Get()
  list(
    @Request() req: { user: { climbingGymId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.climbSessionsService.list(req.user.climbingGymId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.climbSessionsService.get(req.user.climbingGymId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { climbingGymId: string } },
    @Body() dto: CreateClimbSessionDto,
  ) {
    return this.climbSessionsService.create(req.user.climbingGymId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { climbingGymId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateClimbSessionDto,
  ) {
    return this.climbSessionsService.update(req.user.climbingGymId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.climbSessionsService.remove(req.user.climbingGymId, id);
  }
}
