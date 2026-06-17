import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SessionStatus } from '@prisma/client';

export class CreateClimbSessionDto {
  @IsString()
  wallZoneId: string;

  @IsOptional()
  @IsDateString()
  sessionAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  checkIns?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gearRentalRevenue?: number;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClimbSessionDto {
  @IsOptional()
  @IsString()
  wallZoneId?: string;

  @IsOptional()
  @IsDateString()
  sessionAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cashAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cardAmount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  checkIns?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gearRentalRevenue?: number;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
