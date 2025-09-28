import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    // TODO: Implement user registration with database
    const { email, password, name } = registerDto;

    // For now, return a mock response
    await bcrypt.hash(password, 10);

    return {
      message: 'User registered successfully',
      user: {
        id: '1',
        email,
        name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // TODO: Implement user login with database validation
    const { email } = loginDto;

    // For now, return a mock response
    const payload = { email, sub: '1' };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: '1',
        email,
        name: 'Test User',
      },
    };
  }

  async validateUser(email: string, _password: string): Promise<any> {
    // TODO: Implement user validation with database
    // For now, return a mock user
    return {
      id: '1',
      email,
      name: 'Test User',
    };
  }
}
