'use client';
import { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import AOS from 'aos';import 'aos/dist/aos.css';
import Link from 'next/link';

const VistaCategoriaEventos = ({Auxcategoria, modalidad, estado, montoMinimo, montoMaximo }) => {
  const [eventos, setEventos] = useState([]);
  const [carga, setCarga] = useState(true);
  const [userRole, setUserRole] =  useState(null);

  // Leer inscripciones de localStorage al inicio
  const [inscripciones, setInscripciones] = useState(() => {
    const storedInscripciones = localStorage.getItem('inscripciones');
    return storedInscripciones ? JSON.parse(storedInscripciones) : {};
  });

  const updateInscripcionesInLocalStorage = (updatedInscripciones) => {
    localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
    setInscripciones(updatedInscripciones); // Actualiza el estado local también
  };

  //Obtener Rol
  useEffect(() => {
    const role = localStorage.getItem('rol');
    setUserRole(role);
  }, []);

  // Obtener eventos
  useEffect(() => {
    AOS.init({ duration: 1000 });
    const fetchEventos = async () => {
      try {
        const respuesta = await fetch('https://inf281-production.up.railway.app/eventos');
        const datos = await respuesta.json();

        // Filtrar eventos según la categoría seleccionada (Auxcategoria)
        const eventosFiltrados = datos.filter(evento => {
          const filtrarPorCategoria = evento.CategoriasEvento.some(categoria => categoria.categoria.nombre === Auxcategoria);
          const filtrarPorModalidad = modalidad ? evento.modalidad === modalidad : true;
          const filtrarPorEstado = estado ? evento.estado === estado : true;
          const filtrarPorMonto = (montoMinimo ? evento.costo >= montoMinimo : true) && (montoMaximo ? evento.costo <= montoMaximo : true);  
          return filtrarPorCategoria && filtrarPorModalidad && filtrarPorEstado && filtrarPorMonto;
        });

        setEventos(eventosFiltrados);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setCarga(false);
      }
    };

    fetchEventos();
  }, [Auxcategoria, modalidad, estado, montoMinimo, montoMaximo]);

  // Guardar inscripciones en localStorage cuando cambien
  useEffect(() => {
    if (Object.keys(inscripciones).length > 0) {
      localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
    }
  }, [inscripciones]);

  // Si está cargando los eventos
  if (carga) {
    return <p className='text-center text-white text-xl font-semibold'>Cargando eventos...</p>;
  }

  // Si no hay eventos en esa categoría
  if (eventos.length === 0) {
    return <p className='text-center text-white text-xl font-semibold'>No hay eventos disponibles para la categoría {Auxcategoria}.</p>;
  }

  return (
    <div>
      <h2 className="text-white text-3xl font-semibold text-center p-4" data-aos="fade-up">
        EVENTOS DE LA CATEGORÍA {Auxcategoria.toUpperCase()}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {eventos.map((ev) => (
          <div key={ev.id_evento} className="flex flex-col justify-between bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg shadow-md h-full" data-aos="fade-up">
            <h4 className="font-semibold text-center p-4">{ev.titulo}</h4>
            <img
              src={ev.foto_evento}
              alt={ev.titulo}
              width={400}
              height={250}
              className="rounded mx-auto"
            />
            <p className="text-sm text-gray-600 p-2">{ev.descripcion}</p>
            <p className="text-sm text-gray-700 p-2">
              <strong>Fecha: </strong>{new Date(ev.hora_inicio).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 p-2">
              <strong>Hora: </strong>{new Date(ev.hora_inicio).toLocaleTimeString()} - {new Date(ev.hora_fin).toLocaleTimeString()}
            </p>
            <p className="text-sm text-gray-700 p-2">
              <strong>Modalidad: </strong>{ev.modalidad}
            </p>

            {/* Mostrar los Expositores */}
            <div className="text-sm text-gray-600 p-2">
              <strong>Expositores:</strong>
              {ev.Expositores.map((expositor) => (
                <div key={expositor.id_expositor}>
                  <span class="pl-8">*{expositor.nombre} - {expositor.especialidad}</span>
                </div>
              ))}
            </div>

            {/* Mostrar los Patrocinadores */}
            <div className="text-sm text-gray-700 p-2">
              <strong>Patrocinadores:</strong>
              {ev.Eventos_Patrocinadores.map((patrocinador) => (
                <div key={patrocinador.id_patrocina}>
                  <span class="pl-8">*{patrocinador.Patrocinadores.razon_social}</span>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4">
              <Link
                href={`/eventos/vermas/${ev.id_evento}/`}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400 mt-auto"
              >
                VER MÁS
              </Link>
              {(userRole === 'Administrador' || userRole === 'administrador_eventos') && (
                <Link href={`/eventos/editar/${ev.id_evento}`}>
                  <button className="text-yellow py-2 px-6 rounded-full hover:text-red-500">
                    <FaEdit size={20} />
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VistaCategoriaEventos;
