import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { Dispute } from './entities/dispute.entity';
import { DisputeGateway } from './dispute.gateway'; // Your gateway

@Module({
  imports: [TypeOrmModule.forFeature([Dispute])],
  controllers: [DisputesController],
  providers: [DisputesService, DisputeGateway],
})
export class DisputesModule {}