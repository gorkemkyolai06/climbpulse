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
import { RouteSettingsService } from './route-settings.service';
import { CreateRouteSettingDto, UpdateRouteSettingDto } from './dto/route-setting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('route-settings')
@UseGuards(JwtAuthGuard)
export class RouteSettingsController {
  constructor(private routeSettingsService: RouteSettingsService) {}

  @Get()
  list(
    @Request() req: { user: { climbingGymId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.routeSettingsService.list(req.user.climbingGymId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { climbingGymId: string } }) {
    return this.routeSettingsService.urgent(req.user.climbingGymId);
  }

  @Get(':id')
  get(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.routeSettingsService.get(req.user.climbingGymId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { climbingGymId: string } },
    @Body() dto: CreateRouteSettingDto,
  ) {
    return this.routeSettingsService.create(req.user.climbingGymId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { climbingGymId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateRouteSettingDto,
  ) {
    return this.routeSettingsService.update(req.user.climbingGymId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.routeSettingsService.remove(req.user.climbingGymId, id);
  }
}
