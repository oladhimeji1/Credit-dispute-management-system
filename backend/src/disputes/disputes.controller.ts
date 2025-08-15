import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post('create')
  create(@Body() createDisputeDto: CreateDisputeDto, @Request() req) {
    return this.disputesService.create(createDisputeDto, req.user.id);
  }

  @Get('history')
  getHistory(@Request() req) {
    if (req.user.role === UserRole.ADMIN) {
      return this.disputesService.findAll();
    }
    return this.disputesService.findByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disputesService.findOne(id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDisputeStatusDto,
  ) {
    return this.disputesService.updateStatus(
      id,
      updateStatusDto.status,
      updateStatusDto.adminNotes,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDisputeDto: UpdateDisputeDto) {
    return this.disputesService.update(id, updateDisputeDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.disputesService.remove(id);
  }
}