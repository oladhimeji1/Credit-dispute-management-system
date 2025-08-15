import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateDisputeDto {
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @IsNotEmpty()
  @IsString()
  itemType: string;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  supportingDocuments?: string;
}