'use client';
import { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import AOS from 'aos';import 'aos/dist/aos.css';
import Link from 'next/link';

const VistaPatrocinadorEventos = ({patrocinador, modalidad, estado, montoMinimo, montoMaximo }) => {
  const [eventos, setEventos] = useState([]);
  const [carga, setCarga] = useState(true);
  const [userRole, setUserRole] =  useState(null);

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
        const eventosFiltrados = datos.filter(evento => {
          const filtrarPorPatrocinador = evento.Eventos_Patrocinadores.some(patro => patro.Patrocinadores.institucion === patrocinador);
          const filtrarPorModalidad = modalidad ? evento.modalidad === modalidad : true;
          const filtrarPorEstado = estado ? evento.estado === estado : true;
          const filtrarPorMonto = (montoMinimo ? evento.costo >= montoMinimo : true) && (montoMaximo ? evento.costo <= montoMaximo : true);
  
          return filtrarPorPatrocinador && filtrarPorModalidad && filtrarPorEstado && filtrarPorMonto;
        });
        setEventos(eventosFiltrados);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setCarga(false);
      }
    };
  
    fetchEventos();
  }, [patrocinador, modalidad, estado, montoMinimo, montoMaximo]);
  

  // Si está cargando los eventos
  if (carga) {
    return <p className='text-center text-white text-xl font-semibold'>Cargando eventos...</p>;
  }

  // Si no hay eventos en esa categoría
  if (eventos.length === 0) {
    return <p className='text-center text-white text-xl font-semibold'>No hay eventos disponibles para el patrocinador {patrocinador}.</p>;
  }

  return (
    <div className="space-y-10">
      <h2 className="text-white text-2xl font-semibold text-center p-4" data-aos="fade-up">
        EVENTOS AUSPICIADOS POR {patrocinador.toUpperCase()}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventos.map((ev) => (
          <div key={ev.id_evento} className="bg-white p-2 rounded shadow" data-aos="fade-up">
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
                  <span>{expositor.nombre} ({expositor.especialidad})</span>
                </div>
              ))}
            </div>

            {/* Mostrar los Patrocinadores */}
            <div className="text-sm text-gray-700 p-2">
              <strong>Patrocinadores:</strong>
              {ev.Eventos_Patrocinadores.map((patrocinador) => (
                <div key={patrocinador.id_patrocina}>
                  <span>{patrocinador.Patrocinadores.razon_social}</span>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4 py-2">
              <Link
                href={`/eventos/vermas/${ev.id_evento}/`}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400"
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

export default VistaPatrocinadorEventos;
