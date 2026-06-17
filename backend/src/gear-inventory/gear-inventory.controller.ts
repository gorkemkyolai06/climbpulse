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
import { GearInventoryService } from './gear-inventory.service';
import { CreateGearInventoryDto, UpdateGearInventoryDto } from './dto/gear-inventory.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gear-inventory')
@UseGuards(JwtAuthGuard)
export class GearInventoryController {
  constructor(private gearInventoryService: GearInventoryService) {}

  @Get()
  list(
    @Request() req: { user: { climbingGymId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('gearType') gearType?: string,
  ) {
    return this.gearInventoryService.list(req.user.climbingGymId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      gearType,
    });
  }

  @Get('available')
  available(@Request() req: { user: { climbingGymId: string } }) {
    return this.gearInventoryService.available(req.user.climbingGymId);
  }

  @Get(':id')
  get(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.gearInventoryService.get(req.user.climbingGymId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { climbingGymId: string } },
    @Body() dto: CreateGearInventoryDto,
  ) {
    return this.gearInventoryService.create(req.user.climbingGymId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { climbingGymId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateGearInventoryDto,
  ) {
    return this.gearInventoryService.update(req.user.climbingGymId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.gearInventoryService.remove(req.user.climbingGymId, id);
  }
}
