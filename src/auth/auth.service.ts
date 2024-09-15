import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    try {
      const existingUser = await this.usersService.findOneByEmail(email);
      if (existingUser) {
        throw new BadRequestException(
          'Ya hay un usuario registrado usando ese correo',
        );
      }
      return await this.usersService.createUser({
        name,
        email,
        password: await bcrypt.hash(password, 10),
      });
    } catch (error) {
      // Maneja errores aquí
      throw new InternalServerErrorException('Error registering user');
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new UnauthorizedException('El correo es incorrecto');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('La contraseña es incorrecta');
      }

      const payload = { email: user.email, sub: user._id };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
      // Maneja errores aquí
      throw new InternalServerErrorException('Error logging in user');
    }
  }
}
