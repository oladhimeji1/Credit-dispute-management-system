import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Dispute } from '../disputes/entities/dispute.entity';
export declare class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private users;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, userId: string): void;
    notifyDisputeUpdate(dispute: Dispute): void;
    notifyStatusChange(userId: string, message: string): void;
}
