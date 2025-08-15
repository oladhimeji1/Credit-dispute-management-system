import { AiService } from './ai.service';
import { GenerateLetterDto } from './dto/generate-letter.dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateLetter(generateLetterDto: GenerateLetterDto): Promise<{
        letter: string;
    }>;
}
