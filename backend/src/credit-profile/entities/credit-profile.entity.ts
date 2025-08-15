import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('credit_profiles')
export class CreditProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.creditProfile)
  @JoinColumn()
  user: User;

  @Column()
  creditScore: number;

  @Column()
  reportDate: Date;

  @Column('jsonb')
  openAccounts: any[];

  @Column('jsonb')
  creditHistory: any[];

  @Column('jsonb')
  inquiries: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}