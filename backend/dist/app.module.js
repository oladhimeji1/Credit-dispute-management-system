"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const credit_profile_module_1 = require("./credit-profile/credit-profile.module");
const disputes_module_1 = require("./disputes/disputes.module");
const ai_module_1 = require("./ai/ai.module");
const websocket_module_1 = require("./websocket/websocket.module");
const user_entity_1 = require("./users/entities/user.entity");
const credit_profile_entity_1 = require("./credit-profile/entities/credit-profile.entity");
const dispute_entity_1 = require("./disputes/entities/dispute.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABASE_PORT, 10),
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                entities: [user_entity_1.User, credit_profile_entity_1.CreditProfile, dispute_entity_1.Dispute],
                synchronize: process.env.NODE_ENV === 'development',
                logging: process.env.NODE_ENV === 'development',
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    name: 'short',
                    ttl: 1000,
                    limit: 3,
                }, {
                    name: 'medium',
                    ttl: 10000,
                    limit: 20
                }, {
                    name: 'long',
                    ttl: 60000,
                    limit: 100
                }]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            credit_profile_module_1.CreditProfileModule,
            disputes_module_1.DisputesModule,
            ai_module_1.AiModule,
            websocket_module_1.WebSocketModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map