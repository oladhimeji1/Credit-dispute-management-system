"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.typeOrmConfig = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
};
//# sourceMappingURL=database.config.js.map