import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DisputeStatus } from '../entities/dispute.entity';

export class UpdateDisputeStatusDto {
  @IsEnum(DisputeStatus)
  status: DisputeStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}