import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteSettingDto, UpdateRouteSettingDto } from './dto/route-setting.dto';

@Injectable()
export class RouteSettingsService {
  constructor(private prisma: PrismaService) {}

  async list(
    climbingGymId: string,
    params: { page?: number; status?: string; priority?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { climbingGymId };
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;

    const [data, total] = await Promise.all([
      this.prisma.routeSetting.findMany({
        where,
        orderBy: { reportedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          wallZone: { select: { id: true, name: true, section: true } },
        },
      }),
      this.prisma.routeSetting.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async urgent(climbingGymId: string) {
    return this.prisma.routeSetting.findMany({
      where: {
        climbingGymId,
        status: { in: ['open', 'in_progress'] },
        priority: { in: ['high', 'urgent'] },
      },
      include: { wallZone: { select: { name: true, section: true } } },
      orderBy: { reportedAt: 'desc' },
      take: 10,
    });
  }

  async get(climbingGymId: string, id: string) {
    const setting = await this.prisma.routeSetting.findFirst({
      where: { id, climbingGymId },
      include: { wallZone: true },
    });
    if (!setting) throw new NotFoundException('Route setting not found');
    return setting;
  }

  async create(climbingGymId: string, dto: CreateRouteSettingDto) {
    return this.prisma.routeSetting.create({
      data: {
        ...dto,
        climbingGymId,
        reportedAt: dto.reportedAt ? new Date(dto.reportedAt) : new Date(),
      },
      include: { wallZone: true },
    });
  }

  async update(climbingGymId: string, id: string, dto: UpdateRouteSettingDto) {
    await this.get(climbingGymId, id);
    const data = { ...dto };
    if (dto.reportedAt) {
      (data as { reportedAt?: Date }).reportedAt = new Date(dto.reportedAt);
    }
    if (dto.completedAt) {
      (data as { completedAt?: Date }).completedAt = new Date(dto.completedAt);
    }
    return this.prisma.routeSetting.update({
      where: { id },
      data,
      include: { wallZone: true },
    });
  }

  async remove(climbingGymId: string, id: string) {
    await this.get(climbingGymId, id);
    return this.prisma.routeSetting.delete({ where: { id } });
  }
}
