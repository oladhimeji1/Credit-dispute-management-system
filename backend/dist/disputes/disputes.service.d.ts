import { Repository } from 'typeorm';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { Dispute, DisputeStatus } from './entities/dispute.entity';
import { WebSocketGateway } from '../websocket/websocket.gateway';
export declare class DisputesService {
    private disputeRepository;
    private webSocketGateway;
    constructor(disputeRepository: Repository<Dispute>, webSocketGateway: WebSocketGateway);
    create(createDisputeDto: CreateDisputeDto, userId: string): Promise<Dispute>;
    findByUserId(userId: string): Promise<Dispute[]>;
    findAll(): Promise<Dispute[]>;
    findOne(id: string): Promise<Dispute>;
    update(id: string, updateDisputeDto: UpdateDisputeDto): Promise<Dispute>;
    updateStatus(id: string, status: DisputeStatus, adminNotes?: string): Promise<Dispute>;
    remove(id: string): Promise<void>;
}
