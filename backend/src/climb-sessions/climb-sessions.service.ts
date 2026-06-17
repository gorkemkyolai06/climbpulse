import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClimbSessionDto, UpdateClimbSessionDto } from './dto/climb-session.dto';

@Injectable()
export class ClimbSessionsService {
  constructor(private prisma: PrismaService) {}

  async list(climbingGymId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { climbingGymId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.climbSession.findMany({
        where,
        orderBy: { sessionAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          wallZone: { select: { id: true, name: true, section: true, zoneType: true } },
        },
      }),
      this.prisma.climbSession.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(climbingGymId: string, id: string) {
    const session = await this.prisma.climbSession.findFirst({
      where: { id, climbingGymId },
      include: { wallZone: true },
    });
    if (!session) throw new NotFoundException('Climb session not found');
    return session;
  }

  async create(climbingGymId: string, dto: CreateClimbSessionDto) {
    return this.prisma.climbSession.create({
      data: {
        ...dto,
        climbingGymId,
        sessionAt: dto.sessionAt ? new Date(dto.sessionAt) : new Date(),
      },
      include: { wallZone: true },
    });
  }

  async update(climbingGymId: string, id: string, dto: UpdateClimbSessionDto) {
    await this.get(climbingGymId, id);
    const data = { ...dto };
    if (dto.sessionAt) {
      (data as { sessionAt?: Date }).sessionAt = new Date(dto.sessionAt);
    }
    return this.prisma.climbSession.update({
      where: { id },
      data,
      include: { wallZone: true },
    });
  }

  async remove(climbingGymId: string, id: string) {
    await this.get(climbingGymId, id);
    return this.prisma.climbSession.delete({ where: { id } });
  }
}
