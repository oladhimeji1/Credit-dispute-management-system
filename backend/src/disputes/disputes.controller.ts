import { Controller, Post, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Post('create')
  async createDispute(@Req() req, @Body() dto: any) {
    return this.disputesService.createDispute(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@Req() req) {
    if (req.user.role === 'admin') {
      return this.disputesService.findAll();
    }
    return this.disputesService.getUserDisputes(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: any) {
    return this.disputesService.updateDisputeStatus(id, dto.status, dto.adminNotes);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all')
  async getAllDisputes() {
    return this.disputesService.findAll();
  }
}