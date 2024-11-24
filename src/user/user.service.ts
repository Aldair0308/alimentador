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
import * as nodeCron from 'node-cron'; // Importamos node-cron

@Injectable()
export class UserService {
  // Propiedades para gestionar las horas programadas y los cron jobs
  private petCronJobs: { [hora: string]: nodeCron.ScheduledTask[] } = {};
  private lastScheduledHours: string = ''; // Guardamos las horas originales

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    // Llamamos al método para obtener las horas y programar los cron jobs cada 2 minutos
    this.scheduleNotificationsEveryTwoMinutes();
  }

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
  // Método para programar las notificaciones cada 2 minutos
  private scheduleNotificationsEveryTwoMinutes() {
    nodeCron.schedule('*/2 * * * *', async () => {
      console.log('Consultando la API de horas cada 2 minutos...');
      await this.scheduleNotificationsForAllDispensers();
    });
  }

  // Método para programar las notificaciones basado en todos los dispensadores
  private async scheduleNotificationsForAllDispensers() {
    try {
      // 1. Obtener todos los dispensadores
      const dispenserResponse = await fetch(
        'http://192.168.100.169:3000/dispenser',
      );
      const dispensers = await dispenserResponse.json();

      // 2. Iterar sobre cada dispensador para programar notificaciones
      for (const dispenser of dispensers) {
        const dispenserCode = dispenser.code;

        // Obtener las horas asociadas al dispensador
        const petResponse = await fetch(
          `http://192.168.100.169:3000/pets/last/${dispenserCode}`,
        );
        const petData = await petResponse.json();

        if (!petData.horas || petData.horas.length === 0) {
          console.warn(
            `No se encontraron horas para el dispensador ${dispenserCode}`,
          );
          continue;
        }

        // Mostrar las horas obtenidas en consola
        console.log(
          `Horas registradas para el dispensador ${dispenserCode}:`,
          petData.horas,
        );

        // Obtener los usuarios asociados al dispensador
        const usersResponse = await fetch('http://192.168.100.169:3000/users');
        const users = await usersResponse.json();
        const associatedUsers = users.filter(
          (user) => user.code === dispenserCode && user.pushToken,
        );

        // Agrupar y mostrar los pushTokens por código
        const pushTokens = associatedUsers.map((user) => user.pushToken);
        console.log(
          `PushTokens para el dispensador ${dispenserCode}:`,
          pushTokens,
        );

        // Programar notificaciones basadas en las horas
        this.reScheduleNotifications(
          petData.horas,
          associatedUsers,
          dispenserCode,
        );
      }
    } catch (error) {
      console.error(
        'Error al programar notificaciones para los dispensadores:',
        error,
      );
      throw new InternalServerErrorException(
        'Error al programar notificaciones',
      );
    }
  }

  // Reprogramar las notificaciones
  private reScheduleNotifications(
    hours: string[],
    users: any[],
    dispenserCode: string,
  ) {
    console.log(
      `Programando notificaciones para el dispensador ${dispenserCode}...`,
    );

    // Detener los cron jobs antiguos del dispensador
    this.stopPreviousCronJobsForDispenser(dispenserCode);

    // Programar nuevas notificaciones
    hours.forEach((hora) => {
      const cronExpression = this.convertToCronExpression(hora);

      // Programar un cron job para cada hora
      const job = nodeCron.schedule(
        cronExpression,
        () => {
          console.log(
            `Enviando notificaciones para el dispensador ${dispenserCode} a las ${hora}`,
          );
          this.sendNotificationToUsers(users); // Enviar notificación a usuarios asociados
        },
        {
          timeZone: 'America/Mexico_City',
        },
      );

      // Guardar el cron job
      this.petCronJobs[dispenserCode] = this.petCronJobs[dispenserCode] || [];
      this.petCronJobs[dispenserCode].push(job);
    });

    console.log(
      `Notificaciones programadas para el dispensador ${dispenserCode}`,
    );
  }

  // Detener los cron jobs antiguos para un dispensador específico
  private stopPreviousCronJobsForDispenser(dispenserCode: string) {
    if (this.petCronJobs[dispenserCode]) {
      this.petCronJobs[dispenserCode].forEach((job) => job.stop());
      delete this.petCronJobs[dispenserCode];
    }
  }

  // Convertir la hora en formato "HH:MM" a una expresión cron
  private convertToCronExpression(hora: string): string {
    const [hour, minute] = hora.split(':');
    return `${minute} ${hour} * * *`; // Cron para "minuto hora * * *"
  }

  // Enviar notificaciones a los usuarios
  private async sendNotificationToUsers(users: any[]) {
    const message = '¡Tienes una nueva notificación automática!';
    for (const user of users) {
      try {
        console.log(
          `Intentando enviar notificación a ${user.name} con pushToken ${user.pushToken}`,
        );
        await this.sendPushNotification(user.pushToken, message);
      } catch (error) {
        console.error(`Error al enviar notificación a ${user.name}:`, error);
      }
    }
  }

  // Método para enviar una notificación push (igual que antes)
  private async sendPushNotification(pushToken: string, message: string) {
    const messagePayload = {
      to: pushToken,
      sound: 'default',
      title: 'Notificación Automática',
      body: message,
      data: {
        messageType: 'reminder',
      },
      android: {
        icon: './../../assets/icon.png',
        color: '#FF231F7C',
      },
      ios: {
        icon: './assets/icon.png',
      },
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });

      const responseJson = await response.json();
      if (responseJson.data) {
        console.log('Notificación enviada correctamente');
      } else {
        console.warn('Error al enviar notificación');
      }
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
    }
  }
}
