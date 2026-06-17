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
import { RouteRotationsService } from './route-rotations.service';
import { CreateRouteRotationDto, UpdateRouteRotationDto } from './dto/route-rotation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('route-rotations')
@UseGuards(JwtAuthGuard)
export class RouteRotationsController {
  constructor(private routeRotationsService: RouteRotationsService) {}

  @Get()
  list(
    @Request() req: { user: { climbingGymId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.routeRotationsService.list(req.user.climbingGymId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.routeRotationsService.get(req.user.climbingGymId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { climbingGymId: string } },
    @Body() dto: CreateRouteRotationDto,
  ) {
    return this.routeRotationsService.create(req.user.climbingGymId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { climbingGymId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateRouteRotationDto,
  ) {
    return this.routeRotationsService.update(req.user.climbingGymId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.routeRotationsService.remove(req.user.climbingGymId, id);
  }
}
