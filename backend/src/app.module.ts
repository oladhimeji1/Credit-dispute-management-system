import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CreditProfileModule } from './credit-profile/credit-profile.module';
import { DisputesModule } from './disputes/disputes.module';
import { AiModule } from './ai/ai.module';
import { WebSocketModule } from './websocket/websocket.module';
import { User } from './users/entities/user.entity';
import { CreditProfile } from './credit-profile/entities/credit-profile.entity';
import { Dispute } from './disputes/entities/dispute.entity';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, CreditProfile, Dispute],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    // TypeOrmModule.forRoot(typeOrmConfig).
    ThrottlerModule.forRoot([{
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
    AuthModule,
    UsersModule,
    CreditProfileModule,
    DisputesModule,
    AiModule,
    WebSocketModule,
  ],
})
export class AppModule {}