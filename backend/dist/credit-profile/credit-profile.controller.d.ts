import { CreditProfileService } from './credit-profile.service';
export declare class CreditProfileController {
    private readonly creditProfileService;
    constructor(creditProfileService: CreditProfileService);
    findByUserId(userId: string): Promise<import("./entities/credit-profile.entity").CreditProfile>;
}
