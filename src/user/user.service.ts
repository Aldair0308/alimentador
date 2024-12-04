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

// Importamos el NotificationService desde el módulo de notificaciones
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
  // Propiedades para gestionar las horas programadas y los cron jobs
  private petCronJobs: {
    [code: string]: { [hora: string]: nodeCron.ScheduledTask };
  } = {};
  private lastScheduledHours: { [code: string]: string } = {}; // Guardamos las horas originales por code

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private notificationService: NotificationService, // Inyectamos NotificationService
  ) {
    // Llamamos al método para obtener las horas y programar los cron jobs cada 1 minuto
    this.scheduleNotificationsEveryTwoMinutes();
  }

  // Crear un nuevo usuario
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { name, email, password, code } = createUserDto;
      const newUser = new this.userModel({ name, email, password, code });
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

  // Método para enviar una notificación a los usuarios de un código específico
  public async notifyUsersByCode(code: string): Promise<void> {
    try {
      const users = await this.userModel
        .find({ code, pushToken: { $ne: '' } })
        .exec();

      if (users.length === 0) {
        throw new NotFoundException(
          `No se encontraron usuarios con el código ${code}`,
        );
      }

      const message = '¡Tienes una nueva notificación automática!';

      // Enviar la notificación a cada usuario utilizando el NotificationService
      for (const user of users) {
        const pushToken = user.pushToken;
        await this.notificationService.sendPushNotification(pushToken, message);
      }

      console.log(
        `Notificaciones enviadas a los usuarios con el código ${code} Users ${users}`,
      );
    } catch (error) {
      console.error(
        `Error al enviar las notificaciones para el código ${code}:`,
        error,
      );
      throw new InternalServerErrorException(
        `Error enviando las notificaciones para el código ${code}`,
      );
    }
  }

  // Método para programar las notificaciones cada 1 minuto
  private scheduleNotificationsEveryTwoMinutes() {
    nodeCron.schedule('*/1 * * * *', async () => {
      console.log('Consultando la API de horas cada minuto...');
      await this.scheduleNotificationsBasedOnPetHours();
    });
  }

  // Método para programar las notificaciones basado en las horas obtenidas de la API
  private async scheduleNotificationsBasedOnPetHours() {
    try {
      // Hacemos la solicitud GET a tu API para obtener los codes y horas de las mascotas
      const response = await fetch(
        'https://alimentador-production-15ae.up.railway.app/pets/codes',
      );

      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('Failed to fetch pet codes and hours');
      }

      const petsData: { code: string; horas: string[] }[] =
        await response.json();
      console.log('Pets data:', petsData); // Log para depuración

      for (const pet of petsData) {
        const { code, horas } = pet;

        if (!horas || horas.length === 0) {
          console.warn(`No hours found for pet with code ${code}`);
          continue;
        }

        const currentHours = horas.join(',');

        // Si las horas han cambiado para este code, reprogramamos los cron jobs
        if (currentHours !== this.lastScheduledHours[code]) {
          console.log(
            `Las horas han cambiado para el code ${code}, reprogramando las notificaciones...`,
          );
          this.reScheduleNotifications(code, horas);
        } else {
          console.log(
            `Las horas no han cambiado para el code ${code}, manteniendo la programación actual.`,
          );
        }
      }
    } catch (error) {
      console.error('Error al obtener las horas de la API:', error);
      throw new InternalServerErrorException(
        'Error al obtener las horas para programar las notificaciones',
      );
    }
  }

  // Reprogramar las notificaciones para un code específico
  private reScheduleNotifications(code: string, hours: string[]) {
    // Detenemos los cron jobs antiguos para este code
    this.stopPreviousCronJobs(code);

    // Iteramos sobre las horas que nos devuelve la API para este code
    hours.forEach((hora: string) => {
      const cronExpression = this.convertToCronExpression(hora);

      // Programamos un cron job para cada hora
      const job = nodeCron.schedule(
        cronExpression,
        async () => {
          console.log(
            `Enviando notificación a las ${hora} para el code ${code}`,
          );
          // Hacemos una solicitud POST a /users/notify/:code
          try {
            const response = await fetch(
              `https://alimentador-production-15ae.up.railway.app/users/notify/${code}`,
              {
                method: 'POST',
              },
            );

            if (!response.ok) {
              throw new Error(`Failed to send notification to code ${code}`);
            }

            console.log(`Notificación enviada para el code ${code}`);
          } catch (error) {
            console.error(
              `Error al enviar la notificación para el code ${code}:`,
              error,
            );
          }
        },
        {
          timeZone: 'America/Mexico_City', // Usamos la zona horaria de CDMX
        },
      );

      // Guardamos el cron job para futuras referencias
      if (!this.petCronJobs[code]) {
        this.petCronJobs[code] = {};
      }
      this.petCronJobs[code][hora] = job;
    });

    // Actualizamos las horas programadas para este code
    this.lastScheduledHours[code] = hours.join(',');
  }

  // Detener los cron jobs antiguos para un code específico
  private stopPreviousCronJobs(code: string) {
    if (this.petCronJobs[code]) {
      for (const job of Object.values(this.petCronJobs[code])) {
        job.stop();
      }
      delete this.petCronJobs[code];
    }
  }

  // Convertir la hora en formato "HH:MM" a una expresión cron
  private convertToCronExpression(hora: string): string {
    const [hour, minute] = hora.split(':');
    return `${minute} ${hour} * * *`; // Cron para "minuto hora * * *"
  }

  public async sendNotificationToAllUsers(code?: string): Promise<void> {
    try {
      const query = code
        ? { code, pushToken: { $ne: '' } }
        : { pushToken: { $ne: '' } };

      const users = await this.userModel.find(query).exec();

      if (users.length === 0) {
        throw new NotFoundException(
          code
            ? `No se encontraron usuarios con el código ${code}`
            : 'No se encontraron usuarios con pushToken válido',
        );
      }

      const message = '¡Tienes una nueva notificación automática!';

      console.log(
        `Enviando notificaciones a ${users.length} usuarios con el código ${code}`,
      );
      console.log('Usuarios encontrados:', users);

      // Enviar la notificación a cada usuario utilizando el NotificationService
      for (const user of users) {
        const pushToken = user.pushToken;
        console.log(
          `Enviando notificación a ${user.email} con pushToken ${pushToken}`,
        );
        await this.notificationService.sendPushNotification(pushToken, message);
      }

      console.log(
        `Notificaciones enviadas a los usuarios con el código ${code}`,
      );
    } catch (error) {
      console.error(
        `Error al enviar las notificaciones para el código ${code}:`,
        error,
      );
      throw new InternalServerErrorException(
        `Error enviando las notificaciones para el código ${code}`,
      );
    }
  }
}
