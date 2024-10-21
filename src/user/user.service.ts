import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto'; // Asegúrate de que la ruta sea correcta
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Crear un nuevo usuario
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { name, email, password } = createUserDto;
      const newUser = new this.userModel({ name, email, password });
      return await newUser.save();
    } catch (error) {
      console.error('Error in UserService.createUser:', error); // Imprimir el error en la consola para depuración
      throw new InternalServerErrorException('Error creating user');
    }
  }

  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  // Obtener un usuario por su ID
  async findById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by ID');
    }
  }

  // Obtener un usuario por su correo electrónico
  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      // Imprimir el error en la consola para depuración
      console.error('Error fetching user by email:', error);
      throw new InternalServerErrorException('Error fetching user by email');
    }
  }

  // Actualizar un usuario por su ID
  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  // Eliminar un usuario por su ID
  async deleteUser(id: string): Promise<User> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return deletedUser;
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  // Cambiar la contraseña de un usuario
  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Verificar la contraseña
      const isMatch = await this.verifyPassword(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('Old password is incorrect');
      }

      // Hashear la nueva contraseña
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error changing password:', error);
      throw new InternalServerErrorException('Error changing password');
    }
  }

  // Método para verificar la contraseña
  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
