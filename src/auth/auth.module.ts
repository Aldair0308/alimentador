import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importa JwtModule
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module'; // Ajusta la ruta según tu estructura

@Module({
  imports: [
    UserModule, // Importa UserModule para usar UserService
    JwtModule.register({
      secret: 'your_secret_key', // Usa tu propia clave secreta
      signOptions: { expiresIn: '60s' }, // Configuración opcional
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
