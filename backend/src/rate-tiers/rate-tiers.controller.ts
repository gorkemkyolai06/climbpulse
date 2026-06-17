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
import { RateTiersService } from './rate-tiers.service';
import { CreateRateTierDto, UpdateRateTierDto } from './dto/rate-tier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rate-tiers')
@UseGuards(JwtAuthGuard)
export class RateTiersController {
  constructor(private rateTiersService: RateTiersService) {}

  @Get()
  list(
    @Request() req: { user: { climbingGymId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.rateTiersService.list(req.user.climbingGymId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.rateTiersService.get(req.user.climbingGymId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { climbingGymId: string } },
    @Body() dto: CreateRateTierDto,
  ) {
    return this.rateTiersService.create(req.user.climbingGymId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { climbingGymId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateRateTierDto,
  ) {
    return this.rateTiersService.update(req.user.climbingGymId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { climbingGymId: string } }, @Param('id') id: string) {
    return this.rateTiersService.remove(req.user.climbingGymId, id);
  }
}
