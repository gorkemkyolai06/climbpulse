import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SettingPriority, SettingStatus } from '@prisma/client';

export class CreateRouteSettingDto {
  @IsString()
  wallZoneId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsEnum(SettingPriority)
  priority?: SettingPriority;

  @IsOptional()
  @IsEnum(SettingStatus)
  status?: SettingStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateRouteSettingDto {
  @IsOptional()
  @IsString()
  wallZoneId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsEnum(SettingPriority)
  priority?: SettingPriority;

  @IsOptional()
  @IsEnum(SettingStatus)
  status?: SettingStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
