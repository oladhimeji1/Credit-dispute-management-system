import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditProfile } from './entities/credit-profile.entity';

@Injectable()
export class CreditProfileService {
  constructor(
    @InjectRepository(CreditProfile)
    private creditProfileRepository: Repository<CreditProfile>,
  ) {}

  async findByUserId(userId: string): Promise<CreditProfile> {
    let creditProfile = await this.creditProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!creditProfile) {
      // Create a mock credit profile if one doesn't exist
      creditProfile = await this.createMockProfile(userId);
    }

    return creditProfile;
  }

  private async createMockProfile(userId: string): Promise<CreditProfile> {
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

  private generateRandomScore(): number {
    return Math.floor(Math.random() * (850 - 300) + 300);
  }

  private generateMockAccounts() {
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

  private generateMockHistory() {
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

  private generateMockInquiries() {
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
}