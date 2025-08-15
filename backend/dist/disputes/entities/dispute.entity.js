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
exports.Dispute = exports.DisputeStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus["PENDING"] = "pending";
    DisputeStatus["SUBMITTED"] = "submitted";
    DisputeStatus["UNDER_REVIEW"] = "under_review";
    DisputeStatus["RESOLVED"] = "resolved";
    DisputeStatus["REJECTED"] = "rejected";
})(DisputeStatus || (exports.DisputeStatus = DisputeStatus = {}));
let Dispute = class Dispute {
};
exports.Dispute = Dispute;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Dispute.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.disputes),
    __metadata("design:type", user_entity_1.User)
], Dispute.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dispute.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dispute.prototype, "itemType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dispute.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Dispute.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Dispute.prototype, "supportingDocuments", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DisputeStatus,
        default: DisputeStatus.PENDING,
    }),
    __metadata("design:type", String)
], Dispute.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Dispute.prototype, "adminNotes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Dispute.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Dispute.prototype, "updatedAt", void 0);
exports.Dispute = Dispute = __decorate([
    (0, typeorm_1.Entity)('disputes')
], Dispute);
//# sourceMappingURL=dispute.entity.js.map