import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Dispute } from '../disputes/entities/dispute.entity';

@WSGateway({
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.com'] 
      : ['http://localhost:3000'],
    credentials: true,
  },
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>(); // socketId -> userId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.users.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    this.users.set(client.id, userId);
    client.join(`user:${userId}`);
    console.log(`User ${userId} joined room`);
  }

  notifyDisputeUpdate(dispute: Dispute) {
    // Notify the specific user
    this.server.to(`user:${dispute.user.id}`).emit('disputeUpdate', dispute);
    
    // Notify all admins
    this.server.emit('adminDisputeUpdate', dispute);
  }

  notifyStatusChange(userId: string, message: string) {
    this.server.to(`user:${userId}`).emit('statusChange', { message });
  }
}