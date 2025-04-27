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
        content: `Eres un agente virtual especializado en el Bicentenario de Bolivia. Solo debes responder preguntas relacionadas exclusivamente a Bolivia: su historia, cultura, símbolos patrios, presidentes, batallas históricas y eventos actuales relacionados al Bicentenario.

        IMPORTANTE:
        - Solo puedes usar la información proporcionada en la lista de eventos actual.
        - No debes inventar eventos, descripciones, actividades, ni enlaces externos.
        - Si no hay eventos disponibles, responde únicamente con: "Actualmente no hay eventos programados para el Bicentenario de Bolivia. Te invitamos a revisar más adelante."
        
        No debes expandir, inventar, suponer ni agregar narrativa adicional.
        
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
