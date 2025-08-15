"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_profile_entity_1 = require("./entities/credit-profile.entity");
let CreditProfileService = class CreditProfileService {
    constructor(creditProfileRepository) {
        this.creditProfileRepository = creditProfileRepository;
    }
    async findByUserId(userId) {
        let creditProfile = await this.creditProfileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });
        if (!creditProfile) {
            creditProfile = await this.createMockProfile(userId);
        }
        return creditProfile;
    }
    async createMockProfile(userId) {
        const mockProfile = this.creditProfileRepository.create({
            user: { id: userId },
            creditScore: this.generateRandomScore(),
            reportDate: new Date(),
            openAccounts: this.generateMockAccounts(),
            creditHistory: this.generateMockHistory(),
            inquiries: this.generateMockInquiries(),
        });
        return this.creditProfileRepository.save(mockProfile);
    }
    generateRandomScore() {
        return Math.floor(Math.random() * (850 - 300) + 300);
    }
    generateMockAccounts() {
        return [
            {
                accountName: 'Chase Freedom Credit Card',
                accountType: 'Credit Card',
                balance: 2450,
                creditLimit: 8000,
                paymentHistory: 'Current',
                accountAge: '3 years, 2 months',
            },
            {
                accountName: 'Wells Fargo Auto Loan',
                accountType: 'Auto Loan',
                balance: 15800,
                creditLimit: null,
                paymentHistory: 'Current',
                accountAge: '2 years, 8 months',
            },
            {
                accountName: 'Capital One Venture Card',
                accountType: 'Credit Card',
                balance: 890,
                creditLimit: 5000,
                paymentHistory: '30 days late (1 time)',
                accountAge: '1 year, 4 months',
            },
        ];
    }
    generateMockHistory() {
        return [
            {
                date: '2024-01-15',
                action: 'Account opened',
                details: 'Chase Freedom Credit Card',
            },
            {
                date: '2023-12-01',
                action: 'Payment made',
                details: 'Wells Fargo Auto Loan - $425',
            },
            {
                date: '2023-11-15',
                action: 'Late payment reported',
                details: 'Capital One Venture Card - 30 days late',
            },
        ];
    }
    generateMockInquiries() {
        return [
            {
                date: '2024-01-10',
                creditor: 'American Express',
                type: 'Hard Inquiry',
                purpose: 'Credit Card Application',
            },
            {
                date: '2023-10-22',
                creditor: 'TransUnion',
                type: 'Soft Inquiry',
                purpose: 'Background Check',
            },
        ];
    }
};
exports.CreditProfileService = CreditProfileService;
exports.CreditProfileService = CreditProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_profile_entity_1.CreditProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CreditProfileService);
//# sourceMappingURL=credit-profile.service.js.map