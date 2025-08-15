import { IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserDetailsDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class GenerateLetterDto {
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
  additionalContext?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserDetailsDto)
  userDetails?: UserDetailsDto;
}