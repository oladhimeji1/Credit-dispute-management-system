import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { Dispute, DisputeStatus } from './entities/dispute.entity';
import { WebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class DisputesService {
  constructor(
    @InjectRepository(Dispute)
    private disputeRepository: Repository<Dispute>,
    private webSocketGateway: WebSocketGateway,
  ) {}

  async create(createDisputeDto: CreateDisputeDto, userId: string): Promise<Dispute> {
    const dispute = this.disputeRepository.create({
      ...createDisputeDto,
      user: { id: userId },
      status: DisputeStatus.PENDING,
    });

    const savedDispute = await this.disputeRepository.save(dispute);
    
    // Notify via WebSocket
    this.webSocketGateway.notifyDisputeUpdate(savedDispute);
    
    return savedDispute;
  }

  async findByUserId(userId: string): Promise<Dispute[]> {
    return this.disputeRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Dispute[]> {
    return this.disputeRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Dispute> {
    return this.disputeRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: string, updateDisputeDto: UpdateDisputeDto): Promise<Dispute> {
    await this.disputeRepository.update(id, updateDisputeDto);
    const updatedDispute = await this.findOne(id);
    
    // Notify via WebSocket
    this.webSocketGateway.notifyDisputeUpdate(updatedDispute);
    
    return updatedDispute;
  }

  async updateStatus(id: string, status: DisputeStatus, adminNotes?: string): Promise<Dispute> {
    const updateData: Partial<Dispute> = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    await this.disputeRepository.update(id, updateData);
    const updatedDispute = await this.findOne(id);
    
    // Notify via WebSocket
    this.webSocketGateway.notifyDisputeUpdate(updatedDispute);
    
    return updatedDispute;
  }

  async remove(id: string): Promise<void> {
    await this.disputeRepository.delete(id);
  }
}