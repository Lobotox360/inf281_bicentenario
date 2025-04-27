import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma.service';

dotenv.config();

@Injectable()
export class AgenteVirtualService {
  private deepinfraApiKey = process.env.DEEPINFRA_API_KEY;
  private deepinfraUrl = 'https://api.deepinfra.com/v1/openai/chat/completions';

  constructor(private readonly prisma: PrismaService) {}

  async preguntarAlAgente(pregunta: string): Promise<string> {
    const eventos = await this.prisma.eventos.findMany({
      where: {
        fecha: { gte: new Date() }
      },
      select: {
        titulo: true,
        hora_inicio: true,
        hora_fin: true,
        modalidad: true,
        foto_evento: true
      },
      orderBy: {
        fecha: 'asc'
      }
    });

    const eventosTexto = eventos.length > 0
      ? eventos.map((e, idx) => {
          const horaInicio = new Date(e.hora_inicio).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false });
          const horaFin = new Date(e.hora_fin).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false });
          const linkFoto = e.foto_evento ? e.foto_evento : 'Sin imagen disponible';
          return `${idx + 1}. ${e.titulo} - ${horaInicio} a ${horaFin} (${e.modalidad}) - Foto: (${linkFoto})`;
        }).join('\n')
      : 'Actualmente no hay eventos programados.';

    const mensajes = [
      {
        role: 'system',
        content: `Eres un agente virtual especializado en el Bicentenario de Bolivia. Solo debes responder preguntas relacionadas a Bolivia: su historia, cultura, símbolos patrios, presidentes, batallas históricas y eventos actuales del Bicentenario.
        Cuando el usuario pregunte sobre eventos actuales o futuros, SOLO puedes usar la información proporcionada en la lista de eventos a continuación.
        Debes dar el título del evento, la hora de inicio, la hora de fin, la modalidad (presencial, virtual o híbrido) y el enlace de imagen de portada, SIEMPRE basado en los datos proporcionados.
        IMPORTANTE:
        - No debes inventar eventos.
        - No debes inventar ni agregar enlaces externos.
        - No debes recomendar visitar otros sitios web.
        - No debes mencionar recursos fuera de la información proporcionada.
        
        Lista de eventos actuales:
        ${eventosTexto}`
        
      },
      {
        role: 'user',
        content: pregunta
      }
    ];

    const payload = {
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      messages: mensajes,
      temperature: 0.5
    };

    try {
      const response = await axios.post(this.deepinfraUrl, payload, {
        headers: {
          'Authorization': `Bearer ${this.deepinfraApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error preguntando a DeepInfra:', error.response?.data || error.message);
      return 'Lo siento, ocurrió un error al intentar responder.';
    }
  }
}
