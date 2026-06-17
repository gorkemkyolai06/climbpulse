import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ClimbingGymModule } from './climbing-gym/climbing-gym.module';
import { WallZonesModule } from './wall-zones/wall-zones.module';
import { ClimbSessionsModule } from './climb-sessions/climb-sessions.module';
import { RouteSettingsModule } from './route-settings/route-settings.module';
import { RouteRotationsModule } from './route-rotations/route-rotations.module';
import { RateTiersModule } from './rate-tiers/rate-tiers.module';
import { GearInventoryModule } from './gear-inventory/gear-inventory.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    ClimbingGymModule,
    WallZonesModule,
    ClimbSessionsModule,
    RouteSettingsModule,
    RouteRotationsModule,
    RateTiersModule,
    GearInventoryModule,
    DashboardModule,
  ],
})
export class AppModule {}
