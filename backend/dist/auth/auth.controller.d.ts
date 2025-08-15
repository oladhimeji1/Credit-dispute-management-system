import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    login(loginDto: LoginDto, req: any): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    refreshTokens(req: any): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    regenerateToken(userId: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
