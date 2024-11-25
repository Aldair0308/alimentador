import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class NotificationService {
  // Método para enviar una notificación push
  async sendPushNotification(pushToken: string, message: string) {
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
      throw new InternalServerErrorException('Error al enviar la notificación');
    }
  }
}
