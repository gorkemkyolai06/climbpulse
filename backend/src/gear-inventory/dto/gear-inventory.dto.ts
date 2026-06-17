import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { GearStatus, GearType } from '@prisma/client';

export class CreateGearInventoryDto {
  @IsString()
  name: string;

  @IsEnum(GearType)
  gearType: GearType;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsEnum(GearStatus)
  status?: GearStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalPrice?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateGearInventoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(GearType)
  gearType?: GearType;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsEnum(GearStatus)
  status?: GearStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalPrice?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
