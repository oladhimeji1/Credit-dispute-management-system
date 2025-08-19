import { DisputeStatus } from '../entities/dispute.entity';
export declare class AdminResponseDto {
    status: DisputeStatus;
    adminNotes: string;
    resolutionDetails?: string;
    nextSteps?: string;
    estimatedResolutionDate?: string;
}
export declare class BulkStatusUpdateDto {
    disputeIds: string[];
    status: DisputeStatus;
    adminNotes?: string;
}
