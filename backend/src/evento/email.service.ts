import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendReunionIniciadaEmail(email: string, datos: {
    titulo: string;
    link_reunion: string;
    nombre_usuario: string;
  }) {
    const senderEmail = process.env.EMAIL_FROM;
    if (!senderEmail) throw new Error('EMAIL_FROM no está definido en .env');

    const msg: sgMail.MailDataRequired = {
      to: email,
      from: senderEmail,
      subject: `🎥 La reunión del evento ${datos.titulo} ha comenzado`,
      html: `
        <div style="background: #fff8e1; padding: 30px; font-family: 'Segoe UI', Tahoma, sans-serif;">
          <div style="max-width: 680px; margin: auto; background: #ffffff; border-radius: 18px; padding: 35px; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #d84315;">🎥 ¡La reunión ha comenzado!</h2>
            <p style="text-align: center;">Hola <strong>${datos.nombre_usuario}</strong>, la reunión del evento <strong>${datos.titulo}</strong> ya está en curso.</p>
    
            <div style="text-align: center; margin-top: 25px;">
              <a href="${datos.link_reunion}" target="_blank"
                 style="background: #43a047; color: white; padding: 12px 24px;
                 border-radius: 10px; text-decoration: none; font-weight: bold;
                 box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: inline-block;">
                🔗 Unirse a la Reunión
              </a>
            </div>
    
            <div style="text-align: center; margin-top: 15px;">
              <a href="https://inf281-bicentenario-goofy.vercel.app/" target="_blank"
                 style="background: #1e88e5; color: white; padding: 10px 20px;
                 border-radius: 10px; text-decoration: none; font-weight: bold;
                 box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: inline-block;">
                🏠 Ir al Inicio
              </a>
            </div>
    
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
    
            <p style="text-align: center; color: #9e9e9e; font-size: 13px;">
              Mensaje enviado por el sistema <strong style="color: #d84315;">Bicentenario 🇧🇴</strong>
            </p>
          </div>
        </div>
      `,
    };
    

    try {
      await sgMail.send(msg);
      console.log(`✅ Correo de inicio de reunión enviado a ${email}`);
    } catch (error) {
      console.error('❌ Error al enviar correo de inicio de reunión:', error.response?.body || error);
    }
  }
}