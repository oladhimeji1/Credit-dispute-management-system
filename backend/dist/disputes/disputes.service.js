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
const dispute_entity_2 = require("./entities/dispute.entity");
const dispute_gateway_1 = require("./dispute.gateway");
let DisputesService = class DisputesService {
    constructor(disputeRepository, disputeGateway) {
        this.disputeRepository = disputeRepository;
        this.disputeGateway = disputeGateway;
    }
    async createDispute(createDisputeDto, userId) {
        const dispute = this.disputeRepository.create(Object.assign(Object.assign({}, createDisputeDto), { user: { id: userId }, status: dispute_entity_2.DisputeStatus.PENDING }));
        const savedDispute = await this.disputeRepository.save(dispute);
        this.disputeGateway.notifyDisputeCreated(savedDispute);
        return savedDispute;
    }
    async getUserDisputes(userId) {
        return this.disputeRepository.find({
            where: { user: { id: userId } },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const dispute = await this.disputeRepository.findOne({
            where: { id },
            relations: ['user']
        });
        if (!dispute) {
            throw new common_1.NotFoundException(`Dispute with ID ${id} not found`);
        }
        return dispute;
    }
    async updateDisputeStatus(id, status, adminNotes) {
        const dispute = await this.findOne(id);
        dispute.status = status;
        if (adminNotes) {
            dispute.adminNotes = adminNotes;
        }
        const updatedDispute = await this.disputeRepository.save(dispute);
        this.disputeGateway.notifyDisputeUpdated(updatedDispute);
        return updatedDispute;
    }
    async remove(id) {
        const dispute = await this.findOne(id);
        await this.disputeRepository.delete(id);
    }
    async findAll() {
        return this.disputeRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dispute_entity_1.Dispute)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        dispute_gateway_1.DisputeGateway])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map