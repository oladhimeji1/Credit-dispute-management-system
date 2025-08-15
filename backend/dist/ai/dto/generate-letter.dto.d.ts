declare class UserDetailsDto {
    firstName?: string;
    lastName?: string;
    address?: string;
}
export declare class GenerateLetterDto {
    itemName: string;
    itemType: string;
    reason: string;
    additionalContext?: string;
    userDetails?: UserDetailsDto;
}
export {};
