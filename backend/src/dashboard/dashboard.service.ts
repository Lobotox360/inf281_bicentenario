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
          // Eventos en el departamento
          const eventos = await this.prisma.eventos.findMany({
            where: {
              Ubicacion: {
                departamento: dep,
              },
            },
            include: {
              Ubicacion: true,
            },
          });
    
          const eventoIds = eventos.map(e => e.id_evento);
    
          const nro_personas_agendas = await this.prisma.agenda.count({
            where: {
              id_evento: { in: eventoIds },
            },
          });
    
          const nro_admins_eventos = await this.prisma.usuarios.count({
            where: {
              ciudad: dep,
              id_rol: 3,
            },
          });
    
          const puntuacion_promedio = eventos.length > 0
            ? eventos.reduce((acc, curr) => acc + curr.puntuacion, 0) / eventos.length
            : 0;
    
          const nro_eventos_realizados = eventos.filter(
            e => e.hora_fin < now
          ).length;
    
          const nro_comentarios = await this.prisma.agenda.count({
            where: {
              comentario: { not: null },
              id_evento: { in: eventoIds },
            },
          });
    
          resultados[dep] = {
            nro_personas_agendas,
            nro_admins_eventos,
            puntuacion_promedio: parseFloat(puntuacion_promedio.toFixed(2)),
            nro_eventos_realizados,
            nro_comentarios,
          };
        }
    
        return resultados;
      }



}
