import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Crear un nuevo usuario
  @Post()
  async createUser(@Body() body: { name: string; email: string; password: string }): Promise<User> {
    return this.userService.createUser(body.name, body.email, body.password);
  }

  // Obtener todos los usuarios
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // Obtener un usuario por su ID
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  // Obtener un usuario por su correo electrónico
  @Get('email')
  async getUserByEmail(@Query('email') email: string): Promise<User> {
    if (!email) {
      throw new NotFoundException('Email query parameter is required');
    }
    return this.userService.findOneByEmail(email);
  }

  // Actualizar un usuario por su ID
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; password?: string },
  ): Promise<User> {
    return this.userService.updateUser(id, body);
  }

  // Eliminar un usuario por su ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
