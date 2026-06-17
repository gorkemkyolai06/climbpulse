import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(climbingGymId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [
      climbingGym,
      totalWallZones,
      openWallZones,
      unavailableWallZones,
      totalSessions,
      openRouteSettings,
      urgentRouteSettings,
      pendingRouteRotations,
      activeRateTiers,
      availableGear,
      rentedGear,
      revenueTotals,
      recentSessions,
      recentRouteSettings,
      sections,
    ] = await Promise.all([
      this.prisma.climbingGym.findUnique({ where: { id: climbingGymId } }),
      this.prisma.wallZone.count({ where: { climbingGymId } }),
      this.prisma.wallZone.count({ where: { climbingGymId, status: 'open' } }),
      this.prisma.wallZone.count({
        where: { climbingGymId, status: { in: ['closed', 'setting', 'inspection'] } },
      }),
      this.prisma.climbSession.count({ where: { climbingGymId } }),
      this.prisma.routeSetting.count({
        where: { climbingGymId, status: { in: ['open', 'in_progress'] } },
      }),
      this.prisma.routeSetting.count({
        where: {
          climbingGymId,
          status: { in: ['open', 'in_progress'] },
          priority: { in: ['high', 'urgent'] },
        },
      }),
      this.prisma.routeRotation.count({
        where: {
          climbingGymId,
          status: { in: ['scheduled', 'overdue'] },
          scheduledAt: { lte: sevenDaysLater },
        },
      }),
      this.prisma.rateTier.count({
        where: { climbingGymId, status: 'active' },
      }),
      this.prisma.gearInventory.count({
        where: { climbingGymId, status: 'available' },
      }),
      this.prisma.gearInventory.count({
        where: { climbingGymId, status: 'rented' },
      }),
      this.prisma.climbSession.aggregate({
        where: { climbingGymId, sessionAt: { gte: today } },
        _sum: { cashAmount: true, cardAmount: true, gearRentalRevenue: true },
      }),
      this.prisma.climbSession.findMany({
        where: { climbingGymId },
        include: {
          wallZone: { select: { name: true, section: true, zoneType: true } },
        },
        orderBy: { sessionAt: 'desc' },
        take: 5,
      }),
      this.prisma.routeSetting.findMany({
        where: { climbingGymId, status: { in: ['open', 'in_progress'] } },
        include: {
          wallZone: { select: { name: true, section: true } },
        },
        orderBy: { reportedAt: 'desc' },
        take: 5,
      }),
      this.prisma.wallZone.groupBy({
        by: ['section'],
        where: { climbingGymId },
        _count: { id: true },
      }),
    ]);

    const totalCapacity = climbingGym?.totalWallZones || totalWallZones || 1;
    const wallZoneUtilizationRate =
      totalWallZones > 0 ? Math.round((openWallZones / totalWallZones) * 1000) / 10 : 0;

    const dailyRevenue =
      (revenueTotals._sum.cashAmount || 0) +
      (revenueTotals._sum.cardAmount || 0) +
      (revenueTotals._sum.gearRentalRevenue || 0);

    const dailyGearRentalRevenue = revenueTotals._sum.gearRentalRevenue || 0;

    const monthlyTrend = await this.getMonthlyTrend(climbingGymId, sixMonthsAgo);

    return {
      totalWallZones,
      openWallZones,
      unavailableWallZones,
      totalCapacity,
      wallZoneUtilizationRate,
      totalSessions,
      openRouteSettings,
      urgentRouteSettings,
      pendingRouteRotations,
      activeRateTiers,
      availableGear,
      rentedGear,
      dailyRevenue,
      dailyGearRentalRevenue,
      recentSessions,
      recentRouteSettings,
      sections: sections.map((s) => ({
        section: s.section,
        wallZoneCount: s._count.id,
      })),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(climbingGymId: string, since: Date) {
    const sessions = await this.prisma.climbSession.findMany({
      where: { climbingGymId, sessionAt: { gte: since } },
      select: { sessionAt: true, cashAmount: true, cardAmount: true, gearRentalRevenue: true, checkIns: true },
    });

    const months: Record<string, { sessions: number; revenue: number; checkIns: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { sessions: 0, revenue: 0, checkIns: 0 };
    }

    sessions.forEach((session) => {
      const key = `${session.sessionAt.getFullYear()}-${String(session.sessionAt.getMonth() + 1).padStart(2, '0')}`;
      if (months[key]) {
        months[key].sessions++;
        months[key].revenue += session.cashAmount + session.cardAmount + session.gearRentalRevenue;
        months[key].checkIns += session.checkIns;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  }
}
