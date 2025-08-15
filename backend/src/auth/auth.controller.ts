import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Request() req) {
    return this.authService.refreshTokens(req.user.id, req.user.refreshToken);
  }

  @Post('regenerate-token')
  @HttpCode(HttpStatus.OK)
  async regenerateToken(@Body('userId') userId: string) {
    return this.authService.regenerateToken(userId);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('userId') userId: string) {
    return this.authService.logout(userId);
  }
}