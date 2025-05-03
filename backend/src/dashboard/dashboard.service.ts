import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async ObtenerGeneral() {
    const now = new Date().toISOString().slice(0, 16);

    const [
      nro_usuarios_registrados,
      nro_usuarios_mujeres,
      nro_usuarios_hombre,
      nro_usuarios_otros,
      nro_eventos,
      nro_comentarios_total,
      nro_eventos_realizados
    ] = await Promise.all([
      this.prisma.usuarios.count(),
      this.prisma.usuarios.count({
        where: { genero: { equals: 'Femenino', mode: 'insensitive' } },
      }),
      this.prisma.usuarios.count({
        where: { genero: { equals: 'Masculino', mode: 'insensitive' } },
      }),
      this.prisma.usuarios.count({
        where: {
          NOT: {
            genero: { in: ['Masculino', 'Femenino'], mode: 'insensitive' },
          },
        },
      }),
      this.prisma.eventos.count(),
      this.prisma.agenda.count({ where: { comentario: { not: null } } }),
      this.prisma.eventos.count({ where: { hora_fin: { lt: now } } }),
    ]);

    return {
      General: {
        nro_usuarios_registrados,
        nro_usuarios_mujeres,
        nro_usuarios_hombre,
        nro_usuarios_otros,
        nro_eventos,
        nro_comentarios_total,
        nro_eventos_realizados,
      },
    };
  }

  async obtenerEstadisticasPorDepartamento(dep: string) {
    const departamentos = [
      'La Paz', 'Oruro', 'Cochabamba', 'Santa Cruz',
      'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'
    ];

    if (!departamentos.includes(dep)) {
      throw new Error('Departamento no válido');
    }

    const now = new Date().toISOString();
    const nowDate = new Date(now);

    const eventos = await this.prisma.eventos.findMany({
      where: { Ubicacion: { departamento: dep } },
      select: { id_evento: true, puntuacion: true, hora_fin: true }
    });

    const ids = eventos.map(e => e.id_evento);

    const nro_admins_eventos = await this.prisma.usuarios.count({
      where: { ciudad: dep, id_rol: 3 },
    });

    if (ids.length === 0) {
      return {
        nro_personas_agendas: 0,
        nro_admins_eventos,
        puntuacion_promedio: 0,
        nro_eventos_realizados: 0,
        nro_comentarios: 0,
      };
    }

    const [nro_personas_agendas, nro_comentarios] = await Promise.all([
      this.prisma.agenda.count({
        where: { id_evento: { in: ids } },
      }),
      this.prisma.agenda.count({
        where: {
          id_evento: { in: ids },
          comentario: { not: null },
        },
      }),
    ]);

    const puntuaciones = eventos
      .map(e => e.puntuacion)
      .filter(p => p !== null && p !== undefined);

    const puntuacion_promedio = puntuaciones.length
      ? parseFloat((puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length).toFixed(2))
      : 0;

    const nro_eventos_realizados = eventos.filter(
      e => new Date(e.hora_fin) < nowDate
    ).length;

    return {
      nro_personas_agendas,
      nro_admins_eventos,
      puntuacion_promedio,
      nro_eventos_realizados,
      nro_comentarios,
    };
  }

  async eventosResumen() {
    const now = new Date().toISOString().slice(0, 16);

    const [nro_eventos_proximos, modalidades] = await Promise.all([
      this.prisma.eventos.count({
        where: { hora_inicio: { gt: now } },
      }),
      this.prisma.eventos.groupBy({
        by: ['modalidad'],
        _count: { modalidad: true },
      }),
    ]);

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
      _count: { id_rol: true },
    });

    if (conteo.length === 0) return {};

    const roles = await this.prisma.roles.findMany({
      where: {
        id_rol: { in: conteo.map(c => c.id_rol) }
      }
    });

    const resultado = {};
    conteo.forEach(c => {
      const rol = roles.find(r => r.id_rol === c.id_rol);
      resultado[rol?.nombre || `Rol ${c.id_rol}`] = c._count.id_rol;
    });

    return resultado;
  }
}
