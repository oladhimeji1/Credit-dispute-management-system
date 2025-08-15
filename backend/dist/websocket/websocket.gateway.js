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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let WebSocketGateway = class WebSocketGateway {
    constructor() {
        this.users = new Map();
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.users.delete(client.id);
    }
    handleJoin(client, userId) {
        this.users.set(client.id, userId);
        client.join(`user:${userId}`);
        console.log(`User ${userId} joined room`);
    }
    notifyDisputeUpdate(dispute) {
        this.server.to(`user:${dispute.user.id}`).emit('disputeUpdate', dispute);
        this.server.emit('adminDisputeUpdate', dispute);
    }
    notifyStatusChange(userId, message) {
        this.server.to(`user:${userId}`).emit('statusChange', { message });
    }
};
exports.WebSocketGateway = WebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handleJoin", null);
exports.WebSocketGateway = WebSocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? ['https://your-frontend-domain.com']
                : ['http://localhost:3000'],
            credentials: true,
        },
    })
], WebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map