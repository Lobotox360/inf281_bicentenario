import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendPasswordResetEmail(to: string, newPassword: string) {
    const senderEmail = process.env.EMAIL_FROM;
    if (!senderEmail) {
      throw new Error('CUIDADO: El EMAIL de orgien no esta definido en .env');
    }

    const msg: sgMail.MailDataRequired = {
        to,
        from: senderEmail,
        subject: '🔑 Tu Nueva Contraseña - BICENTENARIO',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); background-color: #f9f9f9;">
            <div style="text-align: center;">
              <h2 style="color: #2c3e50;">🔑 Recuperación de Contraseña</h2>
              <p style="font-size: 16px; color: #555;">Hemos generado una nueva contraseña temporal para tu cuenta en <b>BICENTENARIO</b>:</p>
              <div style="background-color: #3498db; color: #fff; padding: 15px; font-size: 24px; font-weight: bold; border-radius: 5px; display: inline-block; margin: 10px 0;">
                ${newPassword}
              </div>
              <p style="font-size: 14px; color: #777;">Por seguridad, te recomendamos cambiarla lo antes posible.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #aaa;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
            </div>
          </div>
        `,
      };
    

    try {
      await sgMail.send(msg);
      console.log(`✅ Nueva contrasena enviada a ${to}`);
      return { message: 'Nueva contrasena enviada correctamente' };
    } catch (error) {
      console.error('❌ Error enviando correo:', error.response?.body || error);
      throw new Error('No se pudo enviar la nueva contrasena');
    }
  }
}
