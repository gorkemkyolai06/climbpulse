import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGearInventoryDto, UpdateGearInventoryDto } from './dto/gear-inventory.dto';

@Injectable()
export class GearInventoryService {
  constructor(private prisma: PrismaService) {}

  async list(
    climbingGymId: string,
    params: { page?: number; status?: string; gearType?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { climbingGymId };
    if (params.status) where.status = params.status;
    if (params.gearType) where.gearType = params.gearType;

    const [data, total] = await Promise.all([
      this.prisma.gearInventory.findMany({
        where,
        orderBy: [{ gearType: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.gearInventory.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async available(climbingGymId: string) {
    return this.prisma.gearInventory.findMany({
      where: { climbingGymId, status: 'available' },
      orderBy: { gearType: 'asc' },
    });
  }

  async get(climbingGymId: string, id: string) {
    const item = await this.prisma.gearInventory.findFirst({
      where: { id, climbingGymId },
    });
    if (!item) throw new NotFoundException('Gear item not found');
    return item;
  }

  async create(climbingGymId: string, dto: CreateGearInventoryDto) {
    return this.prisma.gearInventory.create({ data: { ...dto, climbingGymId } });
  }

  async update(climbingGymId: string, id: string, dto: UpdateGearInventoryDto) {
    await this.get(climbingGymId, id);
    return this.prisma.gearInventory.update({ where: { id }, data: dto });
  }

  async remove(climbingGymId: string, id: string) {
    await this.get(climbingGymId, id);
    return this.prisma.gearInventory.delete({ where: { id } });
  }
}
