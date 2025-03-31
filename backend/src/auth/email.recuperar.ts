import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendPasswordResetEmail(to: string, link: string) {
    const senderEmail = process.env.EMAIL_FROM;
  
    if (!senderEmail) {
      throw new Error('❗ EMAIL_FROM no está definido en el archivo .env');
    }
  
    const msg: sgMail.MailDataRequired = {
      to,
      from: senderEmail,
      subject: '🔐 Restablece tu contraseña',
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>🔑 Recuperación de Contraseña</h2>
          <p>Haz clic en el botón para crear una nueva contraseña:</p>
          <a href="${link}" style="background:#2ecc71;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Cambiar Contraseña</a>
          <p style="font-size:12px;color:#aaa;margin-top:20px;">Este enlace expirará en 15 minutos.</p>
        </div>
      `,
    };
  
    try {
      await sgMail.send(msg);
      console.log(`✅ Email de recuperación enviado a ${to}`);
      return { message: 'Correo enviado correctamente' };
    } catch (error) {
      console.error('❌ Error al enviar correo:', error.response?.body || error);
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }
  
}
