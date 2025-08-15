import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    create(createDisputeDto: CreateDisputeDto, req: any): Promise<import("./entities/dispute.entity").Dispute>;
    getHistory(req: any): Promise<import("./entities/dispute.entity").Dispute[]>;
    findOne(id: string): Promise<import("./entities/dispute.entity").Dispute>;
    updateStatus(id: string, updateStatusDto: UpdateDisputeStatusDto): Promise<import("./entities/dispute.entity").Dispute>;
    update(id: string, updateDisputeDto: UpdateDisputeDto): Promise<import("./entities/dispute.entity").Dispute>;
    remove(id: string): Promise<void>;
}
