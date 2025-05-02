import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async ObtenerGeneral() {
        const now = new Date().toISOString().slice(0, 16);

        const general = {
          nro_usuarios_registrados: await this.prisma.usuarios.count(),
          nro_usuarios_mujeres: await this.prisma.usuarios.count({
            where: { genero: { equals: 'Femenino', mode: 'insensitive' } },
          }),
          nro_usuarios_hombre: await this.prisma.usuarios.count({
            where: { genero: { equals: 'Masculino', mode: 'insensitive' } },
          }),
          nro_usuarios_otros: await this.prisma.usuarios.count({
            where: {
              NOT: {
                genero: { in: ['Masculino', 'Femenino'], mode: 'insensitive' },
              },
            },
          }),
          nro_eventos: await this.prisma.eventos.count(),
          nro_comentarios_total: await this.prisma.agenda.count({
            where: { comentario: { not: null } },
          }),
          nro_eventos_realizados: await this.prisma.eventos.count({
            where: { hora_fin: { lt: now } },
          }),
        };
        return {"General": general};
    }

    async obtenerPorDepartamento() {
      const departamentos = [
        'La Paz', 'Oruro', 'Cochabamba', 'Santa Cruz',
        'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'
      ];
    
      const now = new Date().toISOString().slice(0, 16);
      const resultados = {};
    
      for (const dep of departamentos) {
        // 1. Contar admins de eventos por ciudad
        const nro_admins_eventos = await this.prisma.usuarios.count({
          where: {
            ciudad: dep,
            id_rol: 3,
          },
        });
    
        // 2. Obtener eventos por departamento (solo IDs)
        const eventoIds = await this.prisma.eventos.findMany({
          where: {
            Ubicacion: { departamento: dep },
          },
          select: { id_evento: true },
        });
    
        const ids = eventoIds.map(e => e.id_evento);
    
        // Si no hay eventos, evita errores
        if (ids.length === 0) {
          resultados[dep] = {
            nro_personas_agendas: 0,
            nro_admins_eventos,
            puntuacion_promedio: 0,
            nro_eventos_realizados: 0,
            nro_comentarios: 0,
          };
          continue;
        }
    
        // 3. Calcular puntuación promedio y eventos realizados con aggregate
        const { _avg, _count } = await this.prisma.eventos.aggregate({
          where: {
            id_evento: { in: ids },
          },
          _avg: { puntuacion: true },
          _count: { id_evento: true },
        });
    
        const nro_eventos_realizados = await this.prisma.eventos.count({
          where: {
            id_evento: { in: ids },
            hora_fin: { lt: now },
          },
        });
    
        const nro_personas_agendas = await this.prisma.agenda.count({
          where: {
            id_evento: { in: ids },
          },
        });
    
        const nro_comentarios = await this.prisma.agenda.count({
          where: {
            id_evento: { in: ids },
            comentario: { not: null },
          },
        });
    
        resultados[dep] = {
          nro_personas_agendas,
          nro_admins_eventos,
          puntuacion_promedio: parseFloat((_avg.puntuacion ?? 0).toFixed(2)),
          nro_eventos_realizados,
          nro_comentarios,
        };
      }
    
      return resultados;
    }
    

      async eventosResumen() {
        const now = new Date().toISOString().slice(0, 16);
  
        const nro_eventos_proximos = await this.prisma.eventos.count({
          where: {
            hora_inicio: {
              gt: now,
            },
          },
        });
  
        const modalidades = await this.prisma.eventos.groupBy({
          by: ['modalidad'],
          _count: {
            modalidad: true,
          },
        });
  
        const nro_eventos_por_modalidad = {};
        modalidades.forEach(m => {
          nro_eventos_por_modalidad[m.modalidad] = m._count.modalidad;
        });
  
        return {
          nro_eventos_proximos,
          nro_eventos_por_modalidad,
        };
      }
      async rol() {
        const conteo = await this.prisma.usuarios.groupBy({
          by: ['id_rol'],
          _count: {
            id_rol: true,
          },
        });
  
        const roles = await this.prisma.roles.findMany();
  
        const resultado = {};
        conteo.forEach(c => {
          const rol = roles.find(r => r.id_rol === c.id_rol);
          resultado[rol?.nombre || `Rol ${c.id_rol}`] = c._count.id_rol;
        });
  
        return resultado;
      }



}
