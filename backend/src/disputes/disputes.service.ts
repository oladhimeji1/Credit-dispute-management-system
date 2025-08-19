import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute } from './entities/dispute.entity';
import { DisputeStatus } from './entities/dispute.entity';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { DisputeGateway } from './dispute.gateway';

@Injectable()
export class DisputesService {
  constructor(
    @InjectRepository(Dispute)
    private readonly disputeRepository: Repository<Dispute>,
    private readonly disputeGateway: DisputeGateway,
  ) {}

  async createDispute(createDisputeDto: CreateDisputeDto, userId: string): Promise<Dispute> {
    const dispute = this.disputeRepository.create({
      ...createDisputeDto,
      user: { id: userId },
      status: DisputeStatus.PENDING,
    });

    const savedDispute = await this.disputeRepository.save(dispute);

    // Notify via WebSocket
    this.disputeGateway.notifyDisputeCreated(savedDispute);

    return savedDispute;
  }

  async getUserDisputes(userId: string): Promise<Dispute[]> {
    return this.disputeRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Dispute> {
    const dispute = await this.disputeRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!dispute) {
      throw new NotFoundException(`Dispute with ID ${id} not found`);
    }

    return dispute;
  }

  async updateDisputeStatus(id: string, status: DisputeStatus, adminNotes?: string): Promise<Dispute> {
    const dispute = await this.findOne(id);

    dispute.status = status;
    if (adminNotes) {
      dispute.adminNotes = adminNotes;
    }

    const updatedDispute = await this.disputeRepository.save(dispute);

    // Notify via WebSocket
    this.disputeGateway.notifyDisputeUpdated(updatedDispute);

    return updatedDispute;
  }

  async remove(id: string): Promise<void> {
    const dispute = await this.findOne(id);
    await this.disputeRepository.delete(id);
  }

  async findAll(): Promise<Dispute[]> {
    return this.disputeRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }
}
