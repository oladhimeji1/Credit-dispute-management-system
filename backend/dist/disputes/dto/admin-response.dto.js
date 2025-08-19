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
exports.BulkStatusUpdateDto = exports.AdminResponseDto = void 0;
const class_validator_1 = require("class-validator");
const dispute_entity_1 = require("../entities/dispute.entity");
class AdminResponseDto {
}
exports.AdminResponseDto = AdminResponseDto;
__decorate([
    (0, class_validator_1.IsEnum)(dispute_entity_1.DisputeStatus),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "adminNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "resolutionDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "nextSteps", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminResponseDto.prototype, "estimatedResolutionDate", void 0);
class BulkStatusUpdateDto {
}
exports.BulkStatusUpdateDto = BulkStatusUpdateDto;
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BulkStatusUpdateDto.prototype, "disputeIds", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(dispute_entity_1.DisputeStatus),
    __metadata("design:type", String)
], BulkStatusUpdateDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkStatusUpdateDto.prototype, "adminNotes", void 0);
//# sourceMappingURL=admin-response.dto.js.map