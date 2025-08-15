import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CreditProfileService } from './credit-profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('credit-profile')
@UseGuards(JwtAuthGuard)
export class CreditProfileController {
  constructor(private readonly creditProfileService: CreditProfileService) {}

  @Get(':userId')
  findByUserId(@Param('userId') userId: string) {
    return this.creditProfileService.findByUserId(userId);
  }
}