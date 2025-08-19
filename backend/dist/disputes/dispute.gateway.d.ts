import { Server } from 'socket.io';
export declare class DisputeGateway {
    server: Server;
    notifyDisputeCreated(dispute: any): void;
    notifyDisputeUpdated(dispute: any): void;
}
