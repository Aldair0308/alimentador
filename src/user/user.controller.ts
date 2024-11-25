import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto'; // Importa el DTO si aún no lo has hecho
import { UpdateUserDto } from './dto/update-user.dto'; // Importa el DTO de actualización si lo tienes

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Crear un nuevo usuario
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  // Obtener todos los usuarios
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Obtener un usuario por su ID
  @Get('id/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Obtener un usuario por su correo electrónico
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Actualizar un usuario por su ID
  @Put('id/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Eliminar un usuario por su ID
  @Delete('id/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    const deletedUser = await this.userService.deleteUser(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  @Put('change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<User> {
    const updatedUser = await this.userService.changePassword(
      id,
      body.oldPassword,
      body.newPassword,
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Obtener los pushTokens de los usuarios de una familia por código
  @Get('notification/:code')
  async getPushTokensByCode(@Param('code') code: string): Promise<string[]> {
    return this.userService.getPushTokensByCode(code);
  }

  // Ruta para enviar una notificación a un usuario por su ID
  // @Put('notification/:id')
  // async sendNotificationToUser(@Param('id') id: string): Promise<string> {
  //   try {
  //     await this.userService.sendNotificationToUserById(id); // Invocamos el servicio
  //     return `Notificación enviada al usuario con ID: ${id}`;
  //   } catch (error) {
  //     throw new NotFoundException(
  //       `Error al enviar la notificación a usuario con ID ${id}`,
  //     );
  //   }
  // }
}
