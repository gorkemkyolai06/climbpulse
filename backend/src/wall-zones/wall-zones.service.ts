import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWallZoneDto, UpdateWallZoneDto } from './dto/wall-zone.dto';

@Injectable()
export class WallZonesService {
  constructor(private prisma: PrismaService) {}

  async list(climbingGymId: string, params: { page?: number; status?: string; section?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { climbingGymId };
    if (params.status) where.status = params.status;
    if (params.section) where.section = params.section;

    const [data, total] = await Promise.all([
      this.prisma.wallZone.findMany({
        where,
        orderBy: [{ section: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          routeSettings: {
            where: { status: { in: ['open', 'in_progress'] } },
            take: 1,
            orderBy: { reportedAt: 'desc' },
          },
        },
      }),
      this.prisma.wallZone.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(climbingGymId: string, id: string) {
    const wallZone = await this.prisma.wallZone.findFirst({
      where: { id, climbingGymId },
      include: {
        routeSettings: { orderBy: { reportedAt: 'desc' }, take: 5 },
        climbSessions: { orderBy: { sessionAt: 'desc' }, take: 5 },
      },
    });
    if (!wallZone) throw new NotFoundException('Wall zone not found');
    return wallZone;
  }

  async create(climbingGymId: string, dto: CreateWallZoneDto) {
    return this.prisma.wallZone.create({ data: { ...dto, climbingGymId } });
  }

  async update(climbingGymId: string, id: string, dto: UpdateWallZoneDto) {
    await this.get(climbingGymId, id);
    return this.prisma.wallZone.update({ where: { id }, data: dto });
  }

  async remove(climbingGymId: string, id: string) {
    await this.get(climbingGymId, id);
    return this.prisma.wallZone.delete({ where: { id } });
  }
}
