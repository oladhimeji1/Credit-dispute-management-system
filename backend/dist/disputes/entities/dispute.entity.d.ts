import { User } from '../../users/entities/user.entity';
export declare enum DisputeStatus {
    PENDING = "pending",
    SUBMITTED = "submitted",
    UNDER_REVIEW = "under_review",
    RESOLVED = "resolved",
    REJECTED = "rejected"
}
export declare class Dispute {
    id: string;
    user: User;
    itemName: string;
    itemType: string;
    reason: string;
    description?: string;
    supportingDocuments?: string;
    status: DisputeStatus;
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}
