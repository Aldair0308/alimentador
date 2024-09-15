import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'; // Asegúrate de tener instalado @nestjs/jwt

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService, // Añade JwtService
    ) {}

    async register({ name, email, password }: RegisterDto) {
        // Verificar si el correo electrónico ya está registrado
        const existingUser = await this.usersService.findOneByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Ya hay un usuario registrado usando ese correo');
        }
        // Si el correo electrónico no está registrado, crear el nuevo usuario
        return await this.usersService.createUser(
            name,
            email,
            await bcrypt.hash(password, 10)
        );
        
    }

    async login({ email, password }: LoginDto) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('El correo es incorrecto');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('La contraseña es incorrecta');
        }

        // Generar un token JWT
        const payload = { email: user.email, sub: user._id }; // Ajusta el payload según tu esquema
        const accessToken = this.jwtService.sign(payload);

        return { accessToken }; // Devolver el token JWT
    }
}
