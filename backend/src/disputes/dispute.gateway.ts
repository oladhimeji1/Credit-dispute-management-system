import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class DisputeGateway {
  @WebSocketServer()
  server: Server;

  // Emit when a dispute is created
  notifyDisputeCreated(dispute: any) {
    this.server.emit('disputeCreated', dispute);
  }

  // Emit when a dispute status is updated
  notifyDisputeUpdated(dispute: any) {
    this.server.emit('disputeUpdated', dispute);
  }
}