"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
let AiService = class AiService {
    async generateDisputeLetter(generateLetterDto) {
        const { itemName, itemType, reason, userDetails } = generateLetterDto;
        if (process.env.OPENAI_API_KEY) {
            return this.generateWithOpenAI(generateLetterDto);
        }
        return this.generateMockLetter(generateLetterDto);
    }
    async generateWithOpenAI(generateLetterDto) {
        return this.generateMockLetter(generateLetterDto);
    }
    generateMockLetter(generateLetterDto) {
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

${(userDetails === null || userDetails === void 0 ? void 0 : userDetails.firstName) && (userDetails === null || userDetails === void 0 ? void 0 : userDetails.lastName) ? `
**Personal Information:**
Name: ${userDetails.firstName} ${userDetails.lastName}
` : ''}

I am requesting that this item be investigated and removed from my credit report as it does not accurately reflect my credit history. Under the Fair Credit Reporting Act (FCRA), you are required to investigate disputed items within 30 days of receipt.

Please provide me with written confirmation of the results of your investigation and any corrections made to my credit file.

I have attached supporting documentation to substantiate my claim and look forward to your prompt response.

Thank you for your attention to this matter.

Sincerely,

${(userDetails === null || userDetails === void 0 ? void 0 : userDetails.firstName) && (userDetails === null || userDetails === void 0 ? void 0 : userDetails.lastName) ? `${userDetails.firstName} ${userDetails.lastName}` : '[Your Name]'}

---

This letter was generated using AI assistance to help structure your dispute request. Please review and modify as needed before submitting to the credit bureaus.
    `.trim();
        return { letter };
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map