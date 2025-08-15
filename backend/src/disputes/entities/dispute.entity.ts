import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DisputeStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.disputes)
  user: User;

  @Column()
  itemName: string;

  @Column()
  itemType: string;

  @Column()
  reason: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  supportingDocuments?: string;

  @Column({
    type: 'enum',
    enum: DisputeStatus,
    default: DisputeStatus.PENDING,
  })
  status: DisputeStatus;

  @Column({ nullable: true })
  adminNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}