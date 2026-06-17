-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'front_desk');

-- CreateEnum
CREATE TYPE "WallZoneType" AS ENUM ('boulder', 'top_rope', 'lead', 'speed', 'training');

-- CreateEnum
CREATE TYPE "WallZoneStatus" AS ENUM ('open', 'closed', 'setting', 'inspection');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('recorded', 'verified', 'disputed');

-- CreateEnum
CREATE TYPE "SettingPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "SettingStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "RotationCategory" AS ENUM ('hold_replacement', 'anchor_check', 'mat_inspection', 'wall_clean', 'other');

-- CreateEnum
CREATE TYPE "RotationStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "RateCategory" AS ENUM ('day_pass', 'membership_monthly', 'punch_card', 'private_lesson', 'youth_program', 'other');

-- CreateEnum
CREATE TYPE "RateStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "GearType" AS ENUM ('harness', 'shoes', 'chalk_bag', 'belay_device', 'helmet');

-- CreateEnum
CREATE TYPE "GearStatus" AS ENUM ('available', 'rented', 'maintenance', 'retired');

-- CreateTable
CREATE TABLE "climbing_gyms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_wall_zones" INTEGER NOT NULL DEFAULT 12,
    "timezone" TEXT NOT NULL DEFAULT 'America/Chicago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "climbing_gyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "climbing_gym_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wall_zones" (
    "id" TEXT NOT NULL,
    "climbing_gym_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "zone_type" "WallZoneType" NOT NULL DEFAULT 'boulder',
    "grade_range" TEXT,
    "max_capacity" INTEGER NOT NULL DEFAULT 20,
    "status" "WallZoneStatus" NOT NULL DEFAULT 'open',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wall_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "climb_sessions" (
    "id" TEXT NOT NULL,
    "climbing_gym_id" TEXT NOT NULL,
    "wall_zone_id" TEXT NOT NULL,
    "session_at" TIMESTAMP(3) NOT NULL,
    "cash_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "check_ins" INTEGER NOT NULL DEFAULT 0,
    "gear_rental_revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'recorded',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "climb_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_settings" (
    "id" TEXT NOT NULL,
    "climbing_gym_id" TEXT NOT NULL,
    "wall_zone_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "SettingPriority" NOT NULL DEFAULT 'medium',
    "status" "SettingStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_rotations" (
    "id" TEXT NOT NULL,
    "climbing_gym_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "RotationCategory" NOT NULL DEFAULT 'other',
    "section" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "RotationStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_rotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_tiers" (
    "id" TEXT NOT NULL,
    "climbing_gym_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rate_category" "RateCategory" NOT NULL DEFAULT 'day_pass',
    "status" "RateStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gear_inventory" (
    "id" TEXT NOT NULL,
    "climbing_gym_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gear_type" "GearType" NOT NULL,
    "size" TEXT,
    "status" "GearStatus" NOT NULL DEFAULT 'available',
    "rental_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gear_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "wall_zones_climbing_gym_id_status_idx" ON "wall_zones"("climbing_gym_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "wall_zones_climbing_gym_id_name_key" ON "wall_zones"("climbing_gym_id", "name");

-- CreateIndex
CREATE INDEX "climb_sessions_climbing_gym_id_session_at_idx" ON "climb_sessions"("climbing_gym_id", "session_at");

-- CreateIndex
CREATE INDEX "climb_sessions_climbing_gym_id_status_idx" ON "climb_sessions"("climbing_gym_id", "status");

-- CreateIndex
CREATE INDEX "route_settings_climbing_gym_id_status_idx" ON "route_settings"("climbing_gym_id", "status");

-- CreateIndex
CREATE INDEX "route_settings_climbing_gym_id_priority_idx" ON "route_settings"("climbing_gym_id", "priority");

-- CreateIndex
CREATE INDEX "route_rotations_climbing_gym_id_scheduled_at_idx" ON "route_rotations"("climbing_gym_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "rate_tiers_climbing_gym_id_rate_category_idx" ON "rate_tiers"("climbing_gym_id", "rate_category");

-- CreateIndex
CREATE INDEX "gear_inventory_climbing_gym_id_gear_type_idx" ON "gear_inventory"("climbing_gym_id", "gear_type");

-- CreateIndex
CREATE INDEX "gear_inventory_climbing_gym_id_status_idx" ON "gear_inventory"("climbing_gym_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_climbing_gym_id_fkey" FOREIGN KEY ("climbing_gym_id") REFERENCES "climbing_gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wall_zones" ADD CONSTRAINT "wall_zones_climbing_gym_id_fkey" FOREIGN KEY ("climbing_gym_id") REFERENCES "climbing_gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "climb_sessions" ADD CONSTRAINT "climb_sessions_climbing_gym_id_fkey" FOREIGN KEY ("climbing_gym_id") REFERENCES "climbing_gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "climb_sessions" ADD CONSTRAINT "climb_sessions_wall_zone_id_fkey" FOREIGN KEY ("wall_zone_id") REFERENCES "wall_zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_settings" ADD CONSTRAINT "route_settings_climbing_gym_id_fkey" FOREIGN KEY ("climbing_gym_id") REFERENCES "climbing_gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_settings" ADD CONSTRAINT "route_settings_wall_zone_id_fkey" FOREIGN KEY ("wall_zone_id") REFERENCES "wall_zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_rotations" ADD CONSTRAINT "route_rotations_climbing_gym_id_fkey" FOREIGN KEY ("climbing_gym_id") REFERENCES "climbing_gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_tiers" ADD CONSTRAINT "rate_tiers_climbing_gym_id_fkey" FOREIGN KEY ("climbing_gym_id") REFERENCES "climbing_gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gear_inventory" ADD CONSTRAINT "gear_inventory_climbing_gym_id_fkey" FOREIGN KEY ("climbing_gym_id") REFERENCES "climbing_gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
