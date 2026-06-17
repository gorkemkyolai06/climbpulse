import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { RotationCategory, RotationStatus } from '@prisma/client';

export class CreateRouteRotationDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(RotationCategory)
  category?: RotationCategory;

  @IsOptional()
  @IsString()
  section?: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(RotationStatus)
  status?: RotationStatus;
}

export class UpdateRouteRotationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(RotationCategory)
  category?: RotationCategory;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(RotationStatus)
  status?: RotationStatus;
}
