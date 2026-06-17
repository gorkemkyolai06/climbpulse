import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteRotationDto, UpdateRouteRotationDto } from './dto/route-rotation.dto';

@Injectable()
export class RouteRotationsService {
  constructor(private prisma: PrismaService) {}

  async list(climbingGymId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { climbingGymId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.routeRotation.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.routeRotation.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(climbingGymId: string, id: string) {
    const rotation = await this.prisma.routeRotation.findFirst({
      where: { id, climbingGymId },
    });
    if (!rotation) throw new NotFoundException('Route rotation not found');
    return rotation;
  }

  async create(climbingGymId: string, dto: CreateRouteRotationDto) {
    return this.prisma.routeRotation.create({
      data: {
        ...dto,
        climbingGymId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(climbingGymId: string, id: string, dto: UpdateRouteRotationDto) {
    await this.get(climbingGymId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.routeRotation.update({ where: { id }, data });
  }

  async remove(climbingGymId: string, id: string) {
    await this.get(climbingGymId, id);
    return this.prisma.routeRotation.delete({ where: { id } });
  }
}
