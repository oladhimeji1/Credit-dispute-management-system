import { DisputesService } from './disputes.service';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    createDispute(req: any, dto: any): Promise<import("./entities/dispute.entity").Dispute>;
    getHistory(req: any): Promise<import("./entities/dispute.entity").Dispute[]>;
    updateStatus(id: string, dto: any): Promise<import("./entities/dispute.entity").Dispute>;
    getAllDisputes(): Promise<import("./entities/dispute.entity").Dispute[]>;
}
