import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateLetterDto } from './dto/generate-letter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-letter')
  generateLetter(@Body() generateLetterDto: GenerateLetterDto) {
    return this.aiService.generateDisputeLetter(generateLetterDto);
  }
}