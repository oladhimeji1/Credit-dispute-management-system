import { Injectable } from '@nestjs/common';
import { GenerateLetterDto } from './dto/generate-letter.dto';

@Injectable()
export class AiService {
  async generateDisputeLetter(generateLetterDto: GenerateLetterDto): Promise<{ letter: string }> {
    const { itemName, itemType, reason, userDetails } = generateLetterDto;
    
    // Mock AI response - replace with actual OpenAI integration
    if (process.env.OPENAI_API_KEY) {
      // TODO: Implement actual OpenAI integration
      return this.generateWithOpenAI(generateLetterDto);
    }
    
    return this.generateMockLetter(generateLetterDto);
  }

  private async generateWithOpenAI(generateLetterDto: GenerateLetterDto): Promise<{ letter: string }> {
    // Placeholder for actual OpenAI integration
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    return this.generateMockLetter(generateLetterDto);
  }

  private generateMockLetter(generateLetterDto: GenerateLetterDto): { letter: string } {
    const { itemName, itemType, reason, userDetails } = generateLetterDto;
    
    const currentDate = new Date().toLocaleDateString();
    
    const letter = `
${currentDate}

To Whom It May Concern:

Re: Formal Dispute of ${itemType} - ${itemName}

Dear Credit Bureau Representative,

I am writing to formally dispute the above-mentioned item that appears on my credit report. After careful review of my credit file, I believe this information is inaccurate and requires immediate attention.

**Dispute Details:**
- Item in Question: ${itemName}
- Account Type: ${itemType}
- Reason for Dispute: ${reason}

${userDetails?.firstName && userDetails?.lastName ? `
**Personal Information:**
Name: ${userDetails.firstName} ${userDetails.lastName}
` : ''}

I am requesting that this item be investigated and removed from my credit report as it does not accurately reflect my credit history. Under the Fair Credit Reporting Act (FCRA), you are required to investigate disputed items within 30 days of receipt.

Please provide me with written confirmation of the results of your investigation and any corrections made to my credit file.

I have attached supporting documentation to substantiate my claim and look forward to your prompt response.

Thank you for your attention to this matter.

Sincerely,

${userDetails?.firstName && userDetails?.lastName ? `${userDetails.firstName} ${userDetails.lastName}` : '[Your Name]'}

---

This letter was generated using AI assistance to help structure your dispute request. Please review and modify as needed before submitting to the credit bureaus.
    `.trim();

    return { letter };
  }
}