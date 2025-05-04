import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {

  // ========== ROLES ==========
  const usuarioCasual = await prisma.roles.upsert({
    where: { nombre: 'usuario_casual' },
    update: {},
    create: {
      nombre: 'usuario_casual',
      descripcion_rol: 'Puede ver contenido y administrar su cuenta',
    },
  });

  const admin = await prisma.roles.upsert({
    where: { nombre: 'Administrador' },
    update: {},
    create: {
      nombre: 'Administrador',
      descripcion_rol: 'Tiene acceso al dashboard y puede cambiar roles de usuarios',
    },
  });


  const adminEventos = await prisma.roles.upsert({
    where: { nombre: 'administrador_eventos' },
    update: {},
    create: {
      nombre: 'administrador_eventos',
      descripcion_rol: 'Agrega, edita y elimina eventos',
    },
  });

  const adminContenido = await prisma.roles.upsert({
    where: { nombre: 'administrador_contenido' },
    update: {},
    create: {
      nombre: 'administrador_contenido',
      descripcion_rol: 'Administra el chat visible para el usuario casual',
    },
  });

  // ========== Permisos ==========
  const permisos = [
    // Permisos del Administrador
    { id_rol: admin.id_rol, objeto: 'dashboard', accion: 'get', descripcion_permiso: 'Ver dashboard' },

    { id_rol: admin.id_rol, objeto: 'usuario', accion: 'get', descripcion_permiso: 'Ver su cuenta' },
    { id_rol: admin.id_rol, objeto: 'usuario', accion: 'put', descripcion_permiso: 'Editar su cuenta' },

    { id_rol: admin.id_rol, objeto: 'rol', accion: 'put', descripcion_permiso: 'Cambiar roles de usuario' },
    { id_rol: admin.id_rol, objeto: 'rol', accion: 'get', descripcion_permiso: 'Ve los roles de usuario' },

    { id_rol: admin.id_rol, objeto: 'evento', accion: 'post', descripcion_permiso: 'Crear eventos' },
    { id_rol: admin.id_rol, objeto: 'evento', accion: 'put', descripcion_permiso: 'Editar eventos' },
    { id_rol: admin.id_rol, objeto: 'evento', accion: 'delete', descripcion_permiso: 'Eliminar eventos' },
    { id_rol: admin.id_rol, objeto: 'evento', accion: 'get', descripcion_permiso: 'Ver los eventos' },

    { id_rol: admin.id_rol, objeto: 'patrocinador', accion: 'get', descripcion_permiso: 'Ver a los patrocinadores' },
    { id_rol: admin.id_rol, objeto: 'patrocinador', accion: 'put', descripcion_permiso: 'Editar patrocinadores' },
    { id_rol: admin.id_rol, objeto: 'patrocinador', accion: 'delete', descripcion_permiso: 'Eliminar patrocinadores' },
    { id_rol: admin.id_rol, objeto: 'patrocinador', accion: 'post', descripcion_permiso: 'Agregar patrocinadores' },
    
    { id_rol: admin.id_rol, objeto: 'categoria', accion: 'get', descripcion_permiso: 'Ver a las categorias' },
    { id_rol: admin.id_rol, objeto: 'categoria', accion: 'put', descripcion_permiso: 'Editar categorias' },
    { id_rol: admin.id_rol, objeto: 'categoria', accion: 'delete', descripcion_permiso: 'Eliminar categorias' },
    { id_rol: admin.id_rol, objeto: 'categoria', accion: 'post', descripcion_permiso: 'Agregar categorias' },

    { id_rol: admin.id_rol, objeto: 'telefono', accion: 'get', descripcion_permiso: 'Ver los telefonos' },
    { id_rol: admin.id_rol, objeto: 'telefono', accion: 'put', descripcion_permiso: 'Editar los telefonos' },

    { id_rol: admin.id_rol, objeto: 'expositor', accion: 'get', descripcion_permiso: 'Ver los expositores' },
    { id_rol: admin.id_rol, objeto: 'expositor', accion: 'put', descripcion_permiso: 'Editar los expositores' },

    { id_rol: admin.id_rol, objeto: 'agenda', accion: 'post', descripcion_permiso: 'Ver su agenda' },
    { id_rol: admin.id_rol, objeto: 'agenda', accion: 'get', descripcion_permiso: 'Editar su agenda' },
    { id_rol: admin.id_rol, objeto: 'agenda', accion: 'delete', descripcion_permiso: 'Eliminar su agerda' },

    { id_rol: admin.id_rol, objeto: 'puntuacion', accion: 'get', descripcion_permiso: 'Obtener la puntuacion' },

    // Permisos del usuario casual
    { id_rol: usuarioCasual.id_rol, objeto: 'usuario', accion: 'get', descripcion_permiso: 'Ver su cuenta' },
    { id_rol: usuarioCasual.id_rol, objeto: 'usuario', accion: 'put', descripcion_permiso: 'Editar su cuenta' },
    { id_rol: usuarioCasual.id_rol, objeto: 'usuario', accion: 'delete', descripcion_permiso: 'Eliminar su cuenta' },

    { id_rol: usuarioCasual.id_rol, objeto: 'evento', accion: 'get', descripcion_permiso: 'Ver los eventos' },

    { id_rol: usuarioCasual.id_rol, objeto: 'agenda', accion: 'post', descripcion_permiso: 'Ver su agenda' },
    { id_rol: usuarioCasual.id_rol, objeto: 'agenda', accion: 'get', descripcion_permiso: 'Editar su agenda' },
    { id_rol: usuarioCasual.id_rol, objeto: 'agenda', accion: 'delete', descripcion_permiso: 'Eliminar su agerda' },

    { id_rol: usuarioCasual.id_rol, objeto: 'puntuacion', accion: 'get', descripcion_permiso: 'Obtener la puntuacion' },

    // Permisos del administrador de eventos
    { id_rol: adminEventos.id_rol, objeto: 'evento', accion: 'post', descripcion_permiso: 'Crear eventos' },
    { id_rol: adminEventos.id_rol, objeto: 'evento', accion: 'put', descripcion_permiso: 'Editar eventos' },
    { id_rol: adminEventos.id_rol, objeto: 'evento', accion: 'delete', descripcion_permiso: 'Eliminar eventos' },
    { id_rol: adminEventos.id_rol, objeto: 'evento', accion: 'get', descripcion_permiso: 'Ver los eventos' },

    { id_rol: adminEventos.id_rol, objeto: 'usuario', accion: 'get', descripcion_permiso: 'Ver su cuenta' },
    { id_rol: adminEventos.id_rol, objeto: 'usuario', accion: 'put', descripcion_permiso: 'Editar su cuenta' },
    { id_rol: adminEventos.id_rol, objeto: 'usuario', accion: 'delete', descripcion_permiso: 'Eliminar su cuenta' },

    { id_rol: adminEventos.id_rol, objeto: 'patrocinador', accion: 'get', descripcion_permiso: 'Ver a los patrocinadores' },
    { id_rol: adminEventos.id_rol, objeto: 'patrocinador', accion: 'put', descripcion_permiso: 'Editar patrocinadores' },
    { id_rol: adminEventos.id_rol, objeto: 'patrocinador', accion: 'delete', descripcion_permiso: 'Eliminar patrocinadores' },
    { id_rol: adminEventos.id_rol, objeto: 'patrocinador', accion: 'post', descripcion_permiso: 'Agregar patrocinadores' },
    
    { id_rol: adminEventos.id_rol, objeto: 'categoria', accion: 'get', descripcion_permiso: 'Ver a las categorias' },
    { id_rol: adminEventos.id_rol, objeto: 'categoria', accion: 'put', descripcion_permiso: 'Editar categorias' },
    { id_rol: adminEventos.id_rol, objeto: 'categoria', accion: 'delete', descripcion_permiso: 'Eliminar categorias' },
    { id_rol: adminEventos.id_rol, objeto: 'categoria', accion: 'post', descripcion_permiso: 'Agregar categorias' },

    { id_rol: adminEventos.id_rol, objeto: 'telefono', accion: 'get', descripcion_permiso: 'Ver los telefonos' },
    { id_rol: adminEventos.id_rol, objeto: 'telefono', accion: 'put', descripcion_permiso: 'Editar los telefonos' },

    { id_rol: adminEventos.id_rol, objeto: 'expositor', accion: 'get', descripcion_permiso: 'Ver los expositores' },
    { id_rol: adminEventos.id_rol, objeto: 'expositor', accion: 'put', descripcion_permiso: 'Editar los expositores' },

    { id_rol: adminEventos.id_rol, objeto: 'agenda', accion: 'post', descripcion_permiso: 'Ver su agenda' },
    { id_rol: adminEventos.id_rol, objeto: 'agenda', accion: 'get', descripcion_permiso: 'Editar su agenda' },
    { id_rol: adminEventos.id_rol, objeto: 'agenda', accion: 'delete', descripcion_permiso: 'Eliminar su agerda' },

    { id_rol: adminEventos.id_rol, objeto: 'puntuacion', accion: 'get', descripcion_permiso: 'Obtener la puntuacion' },

    { id_rol: adminEventos.id_rol, objeto: 'dashboard', accion: 'get', descripcion_permiso: 'Ver dashboard' },

    // Permisos del administrador de contenido
    { id_rol: adminContenido.id_rol, objeto: 'agente', accion: 'post', descripcion_permiso: 'Crear agente' },
    { id_rol: adminContenido.id_rol, objeto: 'agente', accion: 'put', descripcion_permiso: 'Editar agente' },
    { id_rol: adminContenido.id_rol, objeto: 'agente', accion: 'delete', descripcion_permiso: 'Eliminar agente' },
    { id_rol: adminContenido.id_rol, objeto: 'usuario', accion: 'get', descripcion_permiso: 'Ver su cuenta' },
    { id_rol: adminContenido.id_rol, objeto: 'usuario', accion: 'put', descripcion_permiso: 'Editar su cuenta' },
    { id_rol: adminContenido.id_rol, objeto: 'usuario', accion: 'delete', descripcion_permiso: 'Eliminar su cuenta' },
  ];

  for (const permiso of permisos) {
    await prisma.permisos.upsert({
      where: {
        id_rol_objeto_accion: {
          id_rol: permiso.id_rol,
          objeto: permiso.objeto,
          accion: permiso.accion,
        },
      },
      update: {},
      create: {
        id_rol: permiso.id_rol,
        objeto: permiso.objeto,
        accion: permiso.accion,
        descripcion_permiso: permiso.descripcion_permiso,
      },
    });
  }

  // Crear Usuario de prueba
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.usuarios.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      nombre: 'Juanito',
      apellidopaterno: 'Perez',
      apellidomaterno: 'Mamani',
      email: 'admin@gmail.com',
      contrasena: hashedPassword,
      foto: 'https://res.cloudinary.com/djxsfzosx/image/upload/v1743888521/perfil_usuario/u6ckp3d3to6qciwnw8ln.png',
      telefono: '+591 79846545',
      pais: 'Bolivia',
      ciudad: 'La Paz',
      genero: 'Masculino',
      verificado: true,
      id_rol: admin.id_rol,
    },
  });
  
  //admin de eventos
  await prisma.usuarios.upsert({
    where: { email: 'adminevento@gmail.com' },
    update: {},
    create: {
      nombre: 'Nicolas',
      apellidopaterno: 'Mamani',
      apellidomaterno: 'Quispe',
      email: 'adminevento@gmail.com',
      contrasena: hashedPassword,
      foto: 'https://res.cloudinary.com/djxsfzosx/image/upload/v1743888521/perfil_usuario/u6ckp3d3to6qciwnw8ln.png',
      telefono: '+591 79846545',
      pais: 'Bolivia',
      ciudad: 'La Paz',
      genero: 'Masculino',
      verificado: true,
      id_rol: adminEventos.id_rol,
    },
  });

  await prisma.usuarios.upsert({
    where: { email: 'usuario@gmail.com' },
    update: {},
    create: {
      nombre: 'Diego',
      apellidopaterno: 'Aruquipa',
      apellidomaterno: 'Condori',
      email: 'usuario@gmail.com',
      contrasena: hashedPassword,
      foto: 'https://res.cloudinary.com/djxsfzosx/image/upload/v1743888521/perfil_usuario/u6ckp3d3to6qciwnw8ln.png',
      telefono: '+591 79846545',
      pais: 'Bolivia',
      ciudad: 'La Paz',
      genero: 'Masculino',
      verificado: true,
      id_rol: usuarioCasual.id_rol,
    },
  });

    // ========== CATEGORÍAS ==========
    const categorias = [
      { nombre: 'Música', descripcion: 'Eventos relacionados con conciertos, grupos y festivales musicales' },
      { nombre: 'Danza', descripcion: 'Eventos que incluyen presentaciones folclóricas y contemporáneas' },
      { nombre: 'Comida', descripcion: 'Eventos gastronómicos, ferias de comida y degustaciones' },
      { nombre: 'Historia', descripcion: 'Eventos culturales o históricos, relacionados con la memoria y tradición' },
    ];
  
    for (const categoria of categorias) {
      await prisma.categorias.upsert({
        where: { nombre: categoria.nombre },
        update: {},
        create: categoria,
      });
    }
  
    // ========== PATROCINADORES ==========
    const patrocinadores = [
      {
        razon_social: 'Cervecería Boliviana Nacional',
        institucion: 'CBN',
      },
      {
        razon_social: 'Gobierno Autónomo Municipal de La Paz',
        institucion: 'GAMLP',
      },
      {
        razon_social: 'Ministerio de Culturas y Turismo',
        institucion: 'Gobierno de Bolivia',
      },
    ];
  
    for (const patrocinador of patrocinadores) {
      await prisma.patrocinadores.upsert({
        where: { razon_social: patrocinador.razon_social },
        update: {},
        create: patrocinador,
      });
    }
  
    console.log('Categorías y patrocinadores agregados correctamente.');
  
  console.log('Seed completo con roles, permisos, categorias, patrocinador y administrador.');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
