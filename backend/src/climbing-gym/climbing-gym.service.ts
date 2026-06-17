import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateClimbingGymDto } from './dto/update-climbing-gym.dto';

@Injectable()
export class ClimbingGymService {
  constructor(private prisma: PrismaService) {}

  async get(climbingGymId: string) {
    const climbingGym = await this.prisma.climbingGym.findUnique({
      where: { id: climbingGymId },
    });
    if (!climbingGym) throw new NotFoundException('Climbing gym not found');
    return climbingGym;
  }

  async update(climbingGymId: string, dto: UpdateClimbingGymDto) {
    await this.get(climbingGymId);
    return this.prisma.climbingGym.update({ where: { id: climbingGymId }, data: dto });
  }
}
