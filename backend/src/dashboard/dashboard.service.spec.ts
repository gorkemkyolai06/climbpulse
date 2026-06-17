import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrisma = {
    climbingGym: { findUnique: jest.fn() },
    wallZone: { count: jest.fn(), groupBy: jest.fn() },
    climbSession: {
      count: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
    },
    routeSetting: { count: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    routeRotation: { count: jest.fn() },
    rateTier: { count: jest.fn() },
    gearInventory: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return climbing gym dashboard stats', async () => {
    mockPrisma.climbingGym.findUnique.mockResolvedValue({ totalWallZones: 12 });
    mockPrisma.wallZone.count
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(2);
    mockPrisma.climbSession.count.mockResolvedValue(42);
    mockPrisma.routeSetting.count.mockResolvedValue(3);
    mockPrisma.climbSession.aggregate.mockResolvedValue({
      _sum: { cashAmount: 120, cardAmount: 280, gearRentalRevenue: 95 },
    });
    mockPrisma.climbSession.findMany.mockResolvedValue([]);
    mockPrisma.routeSetting.findMany.mockResolvedValue([]);
    mockPrisma.routeRotation.count.mockResolvedValue(2);
    mockPrisma.rateTier.count.mockResolvedValue(3);
    mockPrisma.gearInventory.count
      .mockResolvedValueOnce(18)
      .mockResolvedValueOnce(5);
    mockPrisma.wallZone.groupBy.mockResolvedValue([
      { section: 'Main Floor', _count: { id: 2 } },
      { section: 'Rope Area', _count: { id: 2 } },
    ]);

    const stats = await service.getStats('climbing-gym-1');

    expect(stats).toHaveProperty('wallZoneUtilizationRate');
    expect(stats).toHaveProperty('dailyRevenue', 495);
    expect(stats).toHaveProperty('dailyGearRentalRevenue', 95);
    expect(stats).toHaveProperty('sections');
    expect(stats).toHaveProperty('urgentRouteSettings');
    expect(stats).toHaveProperty('pendingRouteRotations');
    expect(stats).toHaveProperty('activeRateTiers', 3);
    expect(stats).toHaveProperty('availableGear', 18);
    expect(stats).toHaveProperty('rentedGear', 5);
    expect(stats).toHaveProperty('openWallZones', 4);
    expect(stats).toHaveProperty('totalWallZones', 6);
  });
});
