import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditProfileService } from './credit-profile.service';
import { CreditProfileController } from './credit-profile.controller';
import { CreditProfile } from './entities/credit-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditProfile])],
  controllers: [CreditProfileController],
  providers: [CreditProfileService],
})
export class CreditProfileModule {}