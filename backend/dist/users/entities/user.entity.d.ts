import { CreditProfile } from '../../credit-profile/entities/credit-profile.entity';
import { Dispute } from '../../disputes/entities/dispute.entity';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    creditProfile: CreditProfile;
    disputes: Dispute[];
}
