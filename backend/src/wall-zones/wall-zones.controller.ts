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
import { WallZonesService } from './wall-zones.service';
import { CreateWallZoneDto, UpdateWallZoneDto } from './dto/wall-zone.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wall-zones')
@UseGuards(JwtAuthGuard)
export class WallZonesController {
  constructor(private wallZonesService: WallZonesService) {}

  @Get()
  list(
    @Request() req: { user: { climbingGymId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('section') section?: string,
  ) {
    return this.wallZonesService.list(req.user.climbingGymId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      section,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.wallZonesService.get(req.user.climbingGymId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { climbingGymId: string } },
    @Body() dto: CreateWallZoneDto,
  ) {
    return this.wallZonesService.create(req.user.climbingGymId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { climbingGymId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateWallZoneDto,
  ) {
    return this.wallZonesService.update(req.user.climbingGymId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.wallZonesService.remove(req.user.climbingGymId, id);
  }
}
