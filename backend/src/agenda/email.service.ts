import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendInscripcionEventoEmail(email: string, datos: {
    titulo: string;
    descripcion: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    modalidad: string;
    costo: string;
    ubicacion?: string;
    direccion?: string;
    telefonos?: { nombre: string; numero: string }[];
    imagen_url?: string;
    nombre_usuario?: string;
  }) {
    const senderEmail = process.env.EMAIL_FROM;
    if (!senderEmail) throw new Error('EMAIL_FROM no está definido en .env');
  
    if (!email || !datos.titulo || !datos.fecha || !datos.hora_inicio || !datos.hora_fin) {
      throw new Error('❌ Faltan datos obligatorios para el envío del correo.');
    }
  
    const defaultImage = 'https://res.cloudinary.com/djxsfzosx/image/upload/v1744514657/eventos/dlmsljwa7clnbrsobxdp.png';
  
    const telHtml = (datos.telefonos || [])
      .map(tel => `<li><strong>${tel.nombre}:</strong> ${tel.numero}</li>`)
      .join('');
    
    // Condicionalmente crear la sección de ubicación basada en la modalidad
    let ubicacionHtml = '';
    if (datos.modalidad.toLowerCase() === 'presencial' || datos.modalidad.toLowerCase() === 'híbrida') {
      const ubicacionLink = datos.ubicacion
        ? `<div style="text-align: center; margin-top: 10px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(datos.ubicacion)}"
               target="_blank"
               style="background: linear-gradient(to right, #ff7043, #ffb74d); color: white; padding: 12px 24px;
                      border-radius: 10px; text-decoration: none; font-weight: bold;
                      box-shadow: 0 3px 10px rgba(255,112,67,0.3); display: inline-block;">
              🗺️ Ver en Google Maps
            </a>
          </div>`
        : '';
      
      ubicacionHtml = `
        <div style="margin-top: 25px;">
          <h4 style="color: #b71c1c;">📍 Ubicación</h4>
          <p style="color: #444;">${datos.ubicacion || 'Ubicación no especificada'}</p>
          ${ubicacionLink}
        </div>
      `;
    }
    
    // Condicionalmente crear mensaje para reunión virtual basado en la modalidad
    let reunionHtml = '';
    if (datos.modalidad.toLowerCase() === 'virtual' || datos.modalidad.toLowerCase() === 'híbrida') {
      reunionHtml = `
        <div style="margin-top: 25px; background: #e8f5e9; padding: 18px; border-radius: 10px; border-left: 4px solid #2e7d32;">
          <h4 style="color: #2e7d32; margin-top: 0;">🖥️ Información para Reunión Virtual</h4>
          <p style="color: #1b5e20; margin-bottom: 0;">
            Cuando se inicie la reunión virtual, recibirás un correo electrónico con el enlace para unirte a la sesión.
            Por favor, mantén este correo electrónico a mano para referencia futura.
          </p>
        </div>
      `;
    }
  
    const msg: sgMail.MailDataRequired = {
      to: email,
      from: senderEmail,
      subject: `📅 Inscripción confirmada: ${datos.titulo}`,
      html: `
    <div style="background: linear-gradient(135deg, #fff8e1, #fff3e0); padding: 30px; font-family: 'Segoe UI', Tahoma, sans-serif;">
      <div style="max-width: 680px; margin: auto; background: #ffffff; border-radius: 18px; padding: 35px; box-shadow: 0 6px 20px rgba(0,0,0,0.1);">
  
        <div style="text-align: center;">
          <h2 style="font-size: 26px; color: #d84315;">🎊 ¡Te has inscrito al evento!</h2>
          <p style="font-size: 16px; color: #616161;">
            ¡Tu registro ha sido exitoso y el evento ha sido agregado a tu agenda del sistema <strong style="color: #d84315;">Bicentenario</strong>! 🇧🇴
          </p>
          <p style="font-size: 16px; color: #616161;">
            Hola, <strong>${datos.nombre_usuario || 'Usuario'}</strong>, ¡felicidades por tu inscripción!
          </p>
        </div>
  
        <img src="${datos.imagen_url || defaultImage}" alt="Imagen del evento"
             style="width: 100%; border-radius: 16px; margin: 25px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  
        <div style="background: #f1f8e9; border-left: 5px solid #7cb342; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px; color: #33691e;">📌 ${datos.titulo}</h3>
          <p style="margin: 0; color: #558b2f;">${datos.descripcion}</p>
        </div>
  
        <div style="margin-top: 25px;">
          <div style="background: #e3f2fd; padding: 12px 15px; border-radius: 10px; margin-bottom: 10px;">
            <strong>📅 Fecha:</strong><br>${datos.fecha}
          </div>
          <div style="background: #fff3e0; padding: 12px 15px; border-radius: 10px; margin-bottom: 10px;">
            <strong>⏰ Horario:</strong><br>${datos.hora_inicio} – ${datos.hora_fin}
          </div>
          <div style="background: #fce4ec; padding: 12px 15px; border-radius: 10px; margin-bottom: 10px;">
            <strong>💰 Costo:</strong><br>${datos.costo}
          </div>
          <div style="background: #ede7f6; padding: 12px 15px; border-radius: 10px; margin-bottom: 10px;">
            <strong>🌐 Modalidad:</strong><br>${datos.modalidad}
          </div>
        </div>
  
        <div style="margin-top: 25px;">
          <h4 style="color: #b71c1c;">📞 Contactos</h4>
          <ul style="padding-left: 20px; color: #424242;">${telHtml || '<li>No disponibles</li>'}</ul>
        </div>
  
        ${ubicacionHtml}
        ${reunionHtml}
  
        <div style="margin-top: 30px; background: #fffde7; border: 1px dashed #fbc02d; padding: 15px; border-radius: 10px; color: #f57f17; text-align: center;">
          ✅ ¡Este evento ha sido agendado correctamente en tu cuenta!
        </div>
  
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
  
        <p style="text-align: center; color: #9e9e9e; font-size: 13px;">
          Mensaje automático enviado por el sistema <strong style="color: #d84315;">Bicentenario 🇧🇴</strong>
        </p>
      </div>
    </div>
    `,
    };
  
    try {
      await sgMail.send(msg);
      console.log(`✅ Correo de inscripción enviado a ${email}`);
    } catch (error) {
      console.error('❌ Error al enviar correo de inscripción:', error.response?.body || error);
    }
  }
}