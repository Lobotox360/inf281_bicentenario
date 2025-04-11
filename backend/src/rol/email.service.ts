import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendRoleChangedEmail(email: string, nuevoRol: string) {
    const senderEmail = process.env.EMAIL_FROM;
    if (!senderEmail) {
      throw new Error('CUIDADO: El EMAIL de origen no está definido en .env');
    }
  
    const msg: sgMail.MailDataRequired = {
      to: email,
      from: senderEmail,
      subject: '🎉 ¡Tu rol ha sido actualizado en BICENTENARIO!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 30px auto; padding: 30px; background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); border-radius: 15px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center;">
            <img src="https://img.icons8.com/emoji/96/party-popper-emoji.png" alt="🎉" style="margin-bottom: 20px;" />
            <h1 style="color: #2c3e50; margin-bottom: 10px;">¡Felicidades!</h1>
            <p style="font-size: 18px; color: #34495e;">Tu rol ha sido actualizado exitosamente dentro de <strong style="color: #2980b9;">BICENTENARIO</strong>.</p>
            <div style="background-color: #dff0d8; color: #3c763d; margin: 25px auto; padding: 15px 20px; border-radius: 8px; font-size: 20px; font-weight: bold; width: fit-content; box-shadow: 0 0 5px rgba(0,0,0,0.05);">
              Nuevo Rol: ${nuevoRol}
            </div>
            <p style="font-size: 16px; color: #555; margin-top: 25px;">A partir de ahora cuentas con nuevos privilegios y funciones que enriquecerán tu experiencia en nuestra plataforma.</p>
            <p style="font-size: 15px; color: #888; margin-top: 30px;">Si no solicitaste este cambio, por favor comunícate con el equipo de soporte de BICENTENARIO.</p>
            <p style="margin-top: 40px; font-size: 14px; color: #aaa;">Con cariño,<br><strong>Equipo BICENTENARIO 🇧🇴</strong></p>
          </div>
        </div>
      `,
    };
  
    try {
      await sgMail.send(msg);
      console.log(`✅ Correo de cambio de rol enviado a ${email}`);
      return { message: 'Correo de cambio de rol enviado correctamente' };
    } catch (error) {
      console.error('❌ Error al enviar correo:', error.response?.body || error);
      throw new Error('No se pudo enviar el correo de cambio de rol');
    }
  }
  
  
  
}