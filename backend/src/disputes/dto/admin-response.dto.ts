import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { DisputeStatus } from '../entities/dispute.entity';

export class AdminResponseDto {
  @IsEnum(DisputeStatus)
  status: DisputeStatus;

  @IsString()
  @IsNotEmpty()
  adminNotes: string;

  @IsOptional()
  @IsString()
  resolutionDetails?: string;

  @IsOptional()
  @IsString()
  nextSteps?: string;

  @IsOptional()
  @IsString()
  estimatedResolutionDate?: string;
}

export class BulkStatusUpdateDto {
  @IsString({ each: true })
  disputeIds: string[];

  @IsEnum(DisputeStatus)
  status: DisputeStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
