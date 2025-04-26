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
    nombre_usuario: string;
    titulo: string;
    modalidad: string;
    sistemaUrl: string;
  }) {
    const senderEmail = process.env.EMAIL_FROM;
    if (!senderEmail) throw new Error('EMAIL_FROM no está definido en .env');
  
    // Personalizar contenido según la modalidad
    let mensajeParticipacion = '';
    if (datos.modalidad.toLowerCase() === 'virtual') {
      mensajeParticipacion = `
        <p style="color: #1b5e20;">
          Ingresa al sistema Bicentenario para unirte a la reunión virtual y participar del evento.
        </p>
      `;
    } else if (datos.modalidad.toLowerCase() === 'híbrida') {
      mensajeParticipacion = `
        <p style="color: #1b5e20;">
          Puedes participar de dos formas:
          <br>• <strong>Virtualmente:</strong> Ingresando al sistema Bicentenario para unirte a la reunión.
          <br>• <strong>Presencialmente:</strong> Asistiendo al lugar del evento.
        </p>
      `;
    }
  
    const msg: sgMail.MailDataRequired = {
      to: email,
      from: senderEmail,
      subject: `🔴 EN VIVO: ${datos.titulo} - La reunión ha comenzado`,
      html: `
      <div style="background: linear-gradient(135deg, #fff8e1, #fff3e0); padding: 30px; font-family: 'Segoe UI', Tahoma, sans-serif;">
        <div style="max-width: 680px; margin: auto; background: #ffffff; border-radius: 18px; padding: 35px; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">
    
          <div style="text-align: center;">
            <h2 style="font-size: 26px; color: #d84315;">🔴 ¡La reunión ha comenzado!</h2>
            <p style="font-size: 16px; color: #616161;">
              Hola <strong>${datos.nombre_usuario}</strong>, la reunión virtual para el evento <strong>${datos.titulo}</strong> ya está en curso.
            </p>
          </div>
    
          <div style="background: #e8f5e9; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
            <h3 style="color: #2e7d32; margin-top: 0;">¡Únete ahora y no te pierdas nada!</h3>
            
            ${mensajeParticipacion}
            
            <div style="margin-top: 25px;">
              <a href="${datos.sistemaUrl}"
                 target="_blank"
                 style="background: linear-gradient(to right, #2e7d32, #4caf50); color: white; padding: 14px 30px;
                        border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;
                        box-shadow: 0 4px 12px rgba(46,125,50,0.3); display: inline-block;">
                💻 Ir al Sistema Bicentenario
              </a>
            </div>
          </div>
    
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin-top: 25px;">
            <p style="color: #e65100; margin: 0; font-size: 14px;">
              <strong>Nota:</strong> Para registrar tu asistencia, deberás ingresar al sistema y seguir las instrucciones 
              correspondientes al evento.
            </p>
          </div>
    
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    
          <p style="text-align: center; color: #9e9e9e; font-size: 13px;">
            Mensaje automático enviado por el sistema <strong style="color: #d84315;">Bicentenario 🇧🇴</strong>
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