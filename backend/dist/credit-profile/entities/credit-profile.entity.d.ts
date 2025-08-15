import { User } from '../../users/entities/user.entity';
export declare class CreditProfile {
    id: string;
    user: User;
    creditScore: number;
    reportDate: Date;
    openAccounts: any[];
    creditHistory: any[];
    inquiries: any[];
    createdAt: Date;
    updatedAt: Date;
}
