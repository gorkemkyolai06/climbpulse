import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const CLIMBING_GYM_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.climbingGym.upsert({
    where: { id: CLIMBING_GYM_ID },
    update: {},
    create: {
      id: CLIMBING_GYM_ID,
      name: 'Vertical Peak Climbing',
      phone: '+18475550142',
      address: '420 Summit Ridge Blvd',
      city: 'Boulder',
      state: 'CO',
      zipCode: '80301',
      totalWallZones: 12,
      timezone: 'America/Denver',
      users: {
        create: {
          email: 'demo@verticalpeakclimbing.com',
          passwordHash,
          firstName: 'Alex',
          lastName: 'Summit',
          role: 'owner',
        },
      },
    },
  });

  const wallZoneData = [
    { id: '00000000-0000-0000-0000-000000000101', name: 'Boulder Cave A', section: 'Main Floor', zoneType: 'boulder' as const, gradeRange: 'V0-V8', maxCapacity: 25, status: 'open' as const },
    { id: '00000000-0000-0000-0000-000000000102', name: 'Boulder Cave B', section: 'Main Floor', zoneType: 'boulder' as const, gradeRange: 'V2-V10', maxCapacity: 25, status: 'open' as const },
    { id: '00000000-0000-0000-0000-000000000103', name: 'Top Rope Wall 1', section: 'Rope Area', zoneType: 'top_rope' as const, gradeRange: '5.6-5.11', maxCapacity: 12, status: 'setting' as const },
    { id: '00000000-0000-0000-0000-000000000104', name: 'Lead Wall', section: 'Rope Area', zoneType: 'lead' as const, gradeRange: '5.9-5.13', maxCapacity: 8, status: 'open' as const },
    { id: '00000000-0000-0000-0000-000000000105', name: 'Speed Wall', section: 'Competition Zone', zoneType: 'speed' as const, gradeRange: '5.10a', maxCapacity: 2, status: 'inspection' as const },
    { id: '00000000-0000-0000-0000-000000000106', name: 'Training Board', section: 'Training Room', zoneType: 'training' as const, gradeRange: 'V4-V12', maxCapacity: 6, status: 'closed' as const },
  ];

  const wallZones = [];
  for (const wz of wallZoneData) {
    const wallZone = await prisma.wallZone.upsert({
      where: { id: wz.id },
      update: {},
      create: { ...wz, climbingGymId: CLIMBING_GYM_ID },
    });
    wallZones.push(wallZone);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.climbSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      climbingGymId: CLIMBING_GYM_ID,
      wallZoneId: wallZones[0].id,
      sessionAt: yesterday,
      cashAmount: 45.0,
      cardAmount: 320.0,
      checkIns: 28,
      gearRentalRevenue: 35.0,
      status: 'verified',
    },
  });

  await prisma.climbSession.upsert({
    where: { id: '00000000-0000-0000-0000-000000000202' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000202',
      climbingGymId: CLIMBING_GYM_ID,
      wallZoneId: wallZones[3].id,
      sessionAt: yesterday,
      cashAmount: 0,
      cardAmount: 185.0,
      checkIns: 14,
      gearRentalRevenue: 60.0,
      status: 'verified',
    },
  });

  const reportedAt = new Date();
  reportedAt.setDate(reportedAt.getDate() - 2);

  await prisma.routeSetting.upsert({
    where: { id: '00000000-0000-0000-0000-000000000301' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000301',
      climbingGymId: CLIMBING_GYM_ID,
      wallZoneId: wallZones[2].id,
      title: 'New top rope set — Wall 1',
      description: 'Strip and reset 8 routes, grades 5.7-5.10',
      reportedAt,
      priority: 'high',
      status: 'in_progress',
    },
  });

  await prisma.routeSetting.upsert({
    where: { id: '00000000-0000-0000-0000-000000000302' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000302',
      climbingGymId: CLIMBING_GYM_ID,
      wallZoneId: wallZones[4].id,
      title: 'Speed wall hold inspection',
      description: 'Competition hold wear check before regional event',
      reportedAt,
      priority: 'urgent',
      status: 'open',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  await prisma.routeRotation.upsert({
    where: { id: '00000000-0000-0000-0000-000000000401' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000401',
      climbingGymId: CLIMBING_GYM_ID,
      title: 'Boulder Cave A hold replacement',
      description: 'Replace worn crimp sets on problems 12-18',
      category: 'hold_replacement',
      section: 'Main Floor',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.routeRotation.upsert({
    where: { id: '00000000-0000-0000-0000-000000000402' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000402',
      climbingGymId: CLIMBING_GYM_ID,
      title: 'Lead wall anchor check',
      category: 'anchor_check',
      section: 'Rope Area',
      scheduledAt: nextWeek,
      status: 'scheduled',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000501' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000501',
      climbingGymId: CLIMBING_GYM_ID,
      title: 'Day Pass',
      rateCategory: 'day_pass',
      basePrice: 22.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000502' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000502',
      climbingGymId: CLIMBING_GYM_ID,
      title: 'Monthly Membership',
      rateCategory: 'membership_monthly',
      basePrice: 79.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  await prisma.rateTier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000503' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000503',
      climbingGymId: CLIMBING_GYM_ID,
      title: '10-Visit Punch Card',
      rateCategory: 'punch_card',
      basePrice: 180.0,
      priceMultiplier: 1.0,
      status: 'active',
    },
  });

  const gearData = [
    { id: '00000000-0000-0000-0000-000000000601', name: 'Petzl Harness M', gearType: 'harness' as const, size: 'M', status: 'available' as const, rentalPrice: 5.0 },
    { id: '00000000-0000-0000-0000-000000000602', name: 'La Sportiva Tarantula 42', gearType: 'shoes' as const, size: '42', status: 'rented' as const, rentalPrice: 6.0 },
    { id: '00000000-0000-0000-0000-000000000603', name: 'Chalk Bag — Blue', gearType: 'chalk_bag' as const, size: null, status: 'available' as const, rentalPrice: 2.0 },
    { id: '00000000-0000-0000-0000-000000000604', name: 'Black Diamond ATC', gearType: 'belay_device' as const, size: null, status: 'available' as const, rentalPrice: 3.0 },
    { id: '00000000-0000-0000-0000-000000000605', name: 'Petzl Helmet S/M', gearType: 'helmet' as const, size: 'S/M', status: 'maintenance' as const, rentalPrice: 4.0 },
  ];

  for (const gear of gearData) {
    await prisma.gearInventory.upsert({
      where: { id: gear.id },
      update: {},
      create: { ...gear, climbingGymId: CLIMBING_GYM_ID },
    });
  }

  console.log('ClimbPulse seed completed — demo@verticalpeakclimbing.com / demo123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
