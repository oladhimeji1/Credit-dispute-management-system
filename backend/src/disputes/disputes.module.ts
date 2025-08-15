import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputesService } from './disputes.service';
import { DisputesController } from './disputes.controller';
import { Dispute } from './entities/dispute.entity';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dispute]), WebSocketModule],
  controllers: [DisputesController],
  providers: [DisputesService],
})
export class DisputesModule {}