"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const disputes_controller_1 = require("./disputes.controller");
const disputes_service_1 = require("./disputes.service");
const dispute_entity_1 = require("./entities/dispute.entity");
const dispute_gateway_1 = require("./dispute.gateway");
let DisputesModule = class DisputesModule {
};
exports.DisputesModule = DisputesModule;
exports.DisputesModule = DisputesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([dispute_entity_1.Dispute])],
        controllers: [disputes_controller_1.DisputesController],
        providers: [disputes_service_1.DisputesService, dispute_gateway_1.DisputeGateway],
    })
], DisputesModule);
//# sourceMappingURL=disputes.module.js.map