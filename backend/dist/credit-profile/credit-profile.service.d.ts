import { Repository } from 'typeorm';
import { CreditProfile } from './entities/credit-profile.entity';
export declare class CreditProfileService {
    private creditProfileRepository;
    constructor(creditProfileRepository: Repository<CreditProfile>);
    findByUserId(userId: string): Promise<CreditProfile>;
    private createMockProfile;
    private generateRandomScore;
    private generateMockAccounts;
    private generateMockHistory;
    private generateMockInquiries;
}
