import { Repository } from 'typeorm';
import { Dispute } from './entities/dispute.entity';
import { DisputeStatus } from './entities/dispute.entity';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { DisputeGateway } from './dispute.gateway';
export declare class DisputesService {
    private readonly disputeRepository;
    private readonly disputeGateway;
    constructor(disputeRepository: Repository<Dispute>, disputeGateway: DisputeGateway);
    createDispute(createDisputeDto: CreateDisputeDto, userId: string): Promise<Dispute>;
    getUserDisputes(userId: string): Promise<Dispute[]>;
    findOne(id: string): Promise<Dispute>;
    updateDisputeStatus(id: string, status: DisputeStatus, adminNotes?: string): Promise<Dispute>;
    remove(id: string): Promise<void>;
    findAll(): Promise<Dispute[]>;
}
