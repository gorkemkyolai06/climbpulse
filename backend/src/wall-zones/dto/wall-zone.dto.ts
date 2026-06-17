import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { WallZoneStatus, WallZoneType } from '@prisma/client';

export class CreateWallZoneDto {
  @IsString()
  name: string;

  @IsString()
  section: string;

  @IsOptional()
  @IsEnum(WallZoneType)
  zoneType?: WallZoneType;

  @IsOptional()
  @IsString()
  gradeRange?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @IsOptional()
  @IsEnum(WallZoneStatus)
  status?: WallZoneStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateWallZoneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsEnum(WallZoneType)
  zoneType?: WallZoneType;

  @IsOptional()
  @IsString()
  gradeRange?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @IsOptional()
  @IsEnum(WallZoneStatus)
  status?: WallZoneStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
