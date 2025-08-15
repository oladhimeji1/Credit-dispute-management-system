import { GenerateLetterDto } from './dto/generate-letter.dto';
export declare class AiService {
    generateDisputeLetter(generateLetterDto: GenerateLetterDto): Promise<{
        letter: string;
    }>;
    private generateWithOpenAI;
    private generateMockLetter;
}
