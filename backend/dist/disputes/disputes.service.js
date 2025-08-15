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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dispute_entity_1 = require("./entities/dispute.entity");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let DisputesService = class DisputesService {
    constructor(disputeRepository, webSocketGateway) {
        this.disputeRepository = disputeRepository;
        this.webSocketGateway = webSocketGateway;
    }
    async create(createDisputeDto, userId) {
        const dispute = this.disputeRepository.create(Object.assign(Object.assign({}, createDisputeDto), { user: { id: userId }, status: dispute_entity_1.DisputeStatus.PENDING }));
        const savedDispute = await this.disputeRepository.save(dispute);
        this.webSocketGateway.notifyDisputeUpdate(savedDispute);
        return savedDispute;
    }
    async findByUserId(userId) {
        return this.disputeRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAll() {
        return this.disputeRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        return this.disputeRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }
    async update(id, updateDisputeDto) {
        await this.disputeRepository.update(id, updateDisputeDto);
        const updatedDispute = await this.findOne(id);
        this.webSocketGateway.notifyDisputeUpdate(updatedDispute);
        return updatedDispute;
    }
    async updateStatus(id, status, adminNotes) {
        const updateData = { status };
        if (adminNotes) {
            updateData.adminNotes = adminNotes;
        }
        await this.disputeRepository.update(id, updateData);
        const updatedDispute = await this.findOne(id);
        this.webSocketGateway.notifyDisputeUpdate(updatedDispute);
        return updatedDispute;
    }
    async remove(id) {
        await this.disputeRepository.delete(id);
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dispute_entity_1.Dispute)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        websocket_gateway_1.WebSocketGateway])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map