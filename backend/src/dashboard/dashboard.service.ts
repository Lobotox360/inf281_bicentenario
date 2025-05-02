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
