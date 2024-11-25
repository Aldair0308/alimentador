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

  // Obtener los pushTokens de los usuarios por código
  async getPushTokensByCode(code: string): Promise<string[]> {
    try {
      const users = await this.userModel
        .find({ code })
        .select('pushToken')
        .exec();

      // Filtramos los usuarios que tienen un pushToken definido y no vacío
      return users
        .map((user) => user.pushToken)
        .filter((pushToken) => pushToken && pushToken.trim() !== '');
    } catch (error) {
      console.error('Error fetching push tokens by code:', error);
      throw new InternalServerErrorException(
        'Error fetching push tokens by code',
      );
    }
  }

  // Método para programar las notificaciones cada 2 minutos
  private scheduleNotificationsEveryTwoMinutes() {
    nodeCron.schedule('*/1 * * * *', async () => {
      console.log('Consultando la API de horas cada 2 minutos...');
      await this.scheduleNotificationsBasedOnPetHours();
    });
  }

  // Método para programar las notificaciones basado en las horas obtenidas de la API
  private async scheduleNotificationsBasedOnPetHours() {
    try {
      // Hacemos la solicitud GET a tu API para obtener las horas de la mascota
      const response = await fetch(
        'http://192.168.100.169:3000/pets/last/3Wa0c71',
      );

      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('Failed to fetch pet hours');
      }

      const petData = await response.json();
      console.log('Pet data:', petData); // Log para depuración

      // Si no hay horas en la respuesta, lanzamos un error
      if (!petData.horas || petData.horas.length === 0) {
        throw new Error('No hours found for pet');
      }

      // Comprobamos si las horas obtenidas son diferentes de las anteriores
      const currentHours = petData.horas.join(',');

      // Si las horas han cambiado, reprogramamos los cron jobs
      if (currentHours !== this.lastScheduledHours) {
        console.log(
          'Las horas han cambiado, reprogramando las notificaciones...',
        );
        this.reScheduleNotifications(petData.horas);
      } else {
        console.log(
          'Las horas no han cambiado, manteniendo la programación actual.',
        );
      }
    } catch (error) {
      console.error('Error al obtener las horas de la API:', error);
      throw new InternalServerErrorException(
        'Error al obtener las horas para programar las notificaciones',
      );
    }
  }

  // Reprogramar las notificaciones
  private reScheduleNotifications(hours: string[]) {
    // Detenemos los cron jobs antiguos
    this.stopPreviousCronJobs();

    // Iteramos sobre las horas que nos devuelve la API
    hours.forEach((hora: string) => {
      const cronExpression = this.convertToCronExpression(hora);

      // Programamos un cron job para cada hora en el array "horas"
      const job = nodeCron.schedule(
        cronExpression,
        () => {
          console.log(`Enviando notificación a las ${hora}`);
          this.sendNotificationToAllUsers(); // Enviamos la notificación
        },
        {
          timeZone: 'America/Mexico_City', // Usamos la zona horaria de CDMX
        },
      );

      // Guardamos el cron job para futuras referencias
      this.petCronJobs[hora] = this.petCronJobs[hora] || [];
      this.petCronJobs[hora].push(job);
    });

    // Actualizamos las horas programadas
    this.lastScheduledHours = hours.join(',');
  }

  // Detener los cron jobs antiguos
  private stopPreviousCronJobs() {
    for (const jobArray of Object.values(this.petCronJobs)) {
      jobArray.forEach((job) => job.stop());
    }
    this.petCronJobs = {}; // Limpiamos los cron jobs previos
  }

  // Convertir la hora en formato "HH:MM" a una expresión cron
  private convertToCronExpression(hora: string): string {
    const [hour, minute] = hora.split(':');
    return `${minute} ${hour} * * *`; // Cron para "minuto hora * * *"
  }

  // Método para enviar una notificación a todos los usuarios
  private async sendNotificationToAllUsers(): Promise<void> {
    try {
      const users = await this.userModel
        .find({ pushToken: { $ne: '' } })
        .exec();
      const message = '¡Tienes una nueva notificación automática!';

      // Enviar la notificación a cada usuario
      for (const user of users) {
        const pushToken = user.pushToken;
        await this.sendPushNotification(pushToken, message);
      }
    } catch (error) {
      console.error('Error al enviar las notificaciones:', error);
      throw new InternalServerErrorException(
        'Error enviando las notificaciones',
      );
    }
  }

  // Método para enviar una notificación push
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
