import * as sgMail from '@sendgrid/mail';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as QRCode from 'qrcode';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Readable } from 'stream';

dotenv.config();

@Injectable()
export class EmailService {
  constructor(private cloudinaryService: CloudinaryService) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  // Método para generar QR y subirlo a Cloudinary (se usa en AgendaService)
  async generateQRCodeAndUpload(token: string): Promise<string> {
    try {
      const qrBuffer = await QRCode.toBuffer(token, { width: 200 });

      const fakeFile = {
        fieldname: 'qr_code',
        originalname: 'qr_code.png',
        mimetype: 'image/png',
        buffer: qrBuffer,
        encoding: '7bit',
        size: qrBuffer.length,
        destination: '',
        filename: 'qr_code.png',
        path: '',
        stream: Readable.from([]),
      };

      const result = await this.cloudinaryService.uploadImage(fakeFile, 'qr_asistencia');
      return result.secure_url;
    } catch (err) {
      throw new Error('Error generando y subiendo el QR: ' + err.message);
    }
  }
async sendInscripcionEventoEmail(email: string, datos: any) {
  const senderEmail = process.env.EMAIL_FROM;
  if (!senderEmail) throw new Error('EMAIL_FROM no está definido en .env');
  if (!email || !datos.titulo || !datos.hora_inicio || !datos.hora_fin) {
    throw new Error('❌ Faltan datos obligatorios para el envío del correo.');
  }
  
  const defaultImage = 'https://res.cloudinary.com/djxsfzosx/image/upload/v1744514657/eventos/dlmsljwa7clnbrsobxdp.png';
  
  // Formatear teléfonos de contacto
  const telHtml = (datos.telefonos || [])
    .map(tel => `<li style="margin-bottom: 10px; font-size: 16px;"><strong>${tel.nombre}:</strong> ${tel.numero}</li>`)  
    .join('');
  
  // Contenido específico según la modalidad
  let modalidadBadge, contenidoHtml = '', qrHtml = '';
  
  if (datos.modalidad.toLowerCase() === 'virtual') {
    modalidadBadge = `<span style="background-color: #3498db; color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px; margin-top: 8px; display: inline-block;">🖥️ VIRTUAL</span>`;
    contenidoHtml = `
      <div style="text-align: center; margin: 30px 0;">
        <h3 style="color: #3498db; font-size: 20px;">Acceso al evento virtual</h3>
        <p style="margin-bottom: 20px; font-size: 16px;">Para participar en este evento y registrar tu asistencia, ingresa al sistema a través del siguiente enlace:</p>
        <a href="https://inf281-bicentenario-goofy.vercel.app/" target="_blank" style="background: #3498db; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: all 0.3s ease; font-size: 16px;">INGRESAR AL SISTEMA</a>
        <p style="color: #666; font-size: 15px; margin-top: 15px;">Tu asistencia se registrará automáticamente al ingresar al sistema</p>
      </div>
    `;
  } else if (datos.modalidad.toLowerCase() === 'presencial') {
    modalidadBadge = `<span style="background-color: #e74c3c; color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px; margin-top: 8px; display: inline-block;">📍 PRESENCIAL</span>`;
    contenidoHtml = `
      <div style="margin: 25px 0;">
        <h3 style="color: #e74c3c; margin-bottom: 15px; font-size: 20px;">📍 Ubicación del Evento</h3>
        <p style="margin-bottom: 20px; font-size: 16px;">${datos.ubicacion || 'No especificada'}</p>
        <div style="text-align: center;">
          <a href="https://www.google.com/maps/search/${encodeURIComponent(datos.ubicacion || '')}" target="_blank" style="background: #e74c3c; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: all 0.3s ease; font-size: 16px;">
            <span style="vertical-align: middle;">VER EN GOOGLE MAPS</span>
            <span style="vertical-align: middle; margin-left: 5px;">🗺️</span>
          </a>
        </div>
      </div>
    `;
    
    qrHtml = datos.qr_url ? `
      <div style="background-color: #f9f9f9; border-radius: 15px; padding: 20px; margin: 30px 0; text-align: center; border: 1px dashed #ddd;">
        <h3 style="color: #e74c3c; margin-bottom: 15px; font-size: 20px;">Tu Código QR de Asistencia</h3>
        <img src="${datos.qr_url}" alt="QR Code" style="width: 180px; height: 180px; border: 8px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 100%;"/>
        <div style="margin-top: 20px; color: #555;">
          <p style="font-size: 16px;"><strong>IMPORTANTE:</strong> Presenta este código QR al ingresar al evento</p>
          <p style="font-size: 16px;">🔍 El personal escaneará tu código para registrar tu asistencia</p>
        </div>
      </div>
    ` : '';

  } else if (datos.modalidad.toLowerCase() === 'híbrido') {
    modalidadBadge = `<span style="background-color: #9b59b6; color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px; margin-top: 8px; display: inline-block;">🔄 HÍBRIDO</span>`;
    contenidoHtml = `
      <div style="margin: 25px 0;">
        <div>
          <div style="margin-bottom: 30px;">
            <h3 style="color: #9b59b6; margin-bottom: 15px; font-size: 20px;">📍 Ubicación para Asistencia Presencial</h3>
            <p style="margin-bottom: 20px; font-size: 16px;">${datos.ubicacion || 'No especificada'}</p>
            <div style="text-align: center;">
              <a href="https://www.google.com/maps/search/${encodeURIComponent(datos.ubicacion || '')}" target="_blank" style="background: #e74c3c; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: all 0.3s ease; font-size: 16px;">
                <span style="vertical-align: middle;">VER EN GOOGLE MAPS</span>
                <span style="vertical-align: middle; margin-left: 5px;">🗺️</span>
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 25px;">
            <h3 style="color: #3498db; margin-bottom: 15px; font-size: 20px;">🖥️ Acceso Virtual al Evento</h3>
            <p style="margin-bottom: 20px; font-size: 16px;">Si prefieres participar virtualmente, ingresa al sistema:</p>
            <a href="https://inf281-bicentenario-goofy.vercel.app/" target="_blank" style="background: #3498db; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); transition: all 0.3s ease; font-size: 16px;">INGRESAR AL SISTEMA</a>
          </div>
        </div>
      </div>
    `;
    
    qrHtml = datos.qr_url ? `
      <div style="background-color: #f9f9f9; border-radius: 15px; padding: 20px; margin: 30px 0; text-align: center; border: 1px dashed #ddd;">
        <h3 style="color: #9b59b6; margin-bottom: 15px; font-size: 20px;">Tu Código QR para Asistencia Presencial</h3>
        <img src="${datos.qr_url}" alt="QR Code" style="width: 180px; height: 180px; border: 8px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.1); max-width: 100%;"/>
        <div style="margin-top: 20px; color: #555;">
          <p style="font-size: 16px;"><strong>IMPORTANTE:</strong> Si asistes presencialmente, presenta este código</p>
          <p style="font-size: 16px;">🔍 El personal escaneará tu código para registrar tu asistencia presencial</p>
        </div>
      </div>
    ` : '';
  }

  // Template completo del email mejorado para responsividad
  const msg = {
    to: email,
    from: senderEmail,
    subject: `📅 Inscripción confirmada: ${datos.titulo}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media only screen and (max-width: 600px) {
            .main-container {
              width: 100% !important;
              padding: 0 !important;
            }
            .content-wrapper {
              padding: 15px !important;
            }
            .header {
              padding: 20px 15px !important;
            }
            .info-card {
              width: 100% !important;
              margin-bottom: 15px !important;
            }
            h1 {
              font-size: 22px !important;
            }
            h2 {
              font-size: 20px !important;
            }
            .event-title {
              display: block !important;
            }
            .event-badge {
              margin-left: 0 !important;
              margin-top: 10px !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f0f0f0;">
        <div class="main-container" style="max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <!-- Header -->
          <div class="header" style="background-color: #d84315; color: white; text-align: center; padding: 30px 20px; border-radius: 0 0 20px 20px;">
            <h1 style="margin: 0; font-size: 26px;">🎉 ¡Inscripción Confirmada!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">¡Hola, ${datos.nombre_usuario || ''}!</p>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Tu registro ha sido procesado con éxito</p>
          </div>
          
          <!-- Main Content -->
          <div class="content-wrapper" style="background-color: white; border-radius: 10px; margin: 20px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <!-- Banner de imagen -->
            <img src="${datos.imagen_url || defaultImage}" alt="${datos.titulo}" style="width: 100%; border-radius: 10px; margin-bottom: 25px; height: auto; object-fit: cover; max-height: 250px;"/>
            
            <!-- Detalles del evento -->
            <div>
              <div class="event-title" style="margin-bottom: 15px;">
                <h2 style="color: #2c3e50; margin-top: 0; margin-bottom: 10px; font-size: 24px;">
                  ${datos.titulo}
                </h2>
                <div class="event-badge">
                  ${modalidadBadge}
                </div>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
                ${datos.descripcion || ''}
              </p>
              
              <!-- Info cards -->
              <div style="margin: 25px 0;">
                <div class="info-card" style="background-color: #f8f9fa; border-radius: 10px; padding: 15px; border-left: 4px solid #3498db; margin-bottom: 15px;">
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">📅 FECHA</p>
                  <p style="margin: 0; font-weight: bold; font-size: 16px;">${datos.fecha_inicio}${datos.fecha_fin !== datos.fecha_inicio ? ` al ${datos.fecha_fin}` : ''}</p>
                </div>
                
                <div class="info-card" style="background-color: #f8f9fa; border-radius: 10px; padding: 15px; border-left: 4px solid #e74c3c; margin-bottom: 15px;">
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">⏰ HORARIO</p>
                  <p style="margin: 0; font-weight: bold; font-size: 16px;">${datos.hora_inicio} - ${datos.hora_fin}</p>
                </div>
              
                <div class="info-card" style="background-color: #f8f9fa; border-radius: 10px; padding: 15px; border-left: 4px solid #2ecc71; margin-bottom: 15px;">
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">💰 COSTO</p>
                  <p style="margin: 0; font-weight: bold; font-size: 16px;">${datos.costo}</p>
                </div>
              </div>
            </div>
            
            <!-- Contenido específico según modalidad -->
            ${contenidoHtml}
            
            <!-- QR Code si aplica -->
            ${qrHtml}
            
            <!-- Contactos -->
            <div style="margin-top: 30px; background-color: #f8f9fa; border-radius: 10px; padding: 20px;">
              <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 20px;">📞 Contactos para consultas</h3>
              <ul style="list-style-type: none; padding-left: 5px; margin-top: 15px;">
                ${telHtml || '<li style="font-size: 16px;">No hay contactos disponibles</li>'}
              </ul>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
            <p style="font-size: 15px;">Este es un mensaje automático del sistema</p>
            <p style="margin: 5px 0 20px 0; font-size: 16px;"><strong>Bicentenario 🇧🇴</strong></p>
            <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px; font-size: 14px; color: #999;">
              No responda a este correo electrónico.
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  
  await sgMail.send(msg);
  console.log(`✅ Correo de inscripción enviado a ${email}`);
}

}
