'use client';
import { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';

const VistaCategoriaEventos = ({ userRole = 'admin', Auxcategoria }) => {
  const [eventos, setEventos] = useState([]);
  const [carga, setCarga] = useState(true);

  // Leer inscripciones de localStorage al inicio
  const [inscripciones, setInscripciones] = useState(() => {
    const storedInscripciones = localStorage.getItem('inscripciones');
    return storedInscripciones ? JSON.parse(storedInscripciones) : {};
  });

  const updateInscripcionesInLocalStorage = (updatedInscripciones) => {
    localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
    setInscripciones(updatedInscripciones); // Actualiza el estado local también
  };

  // Obtener eventos
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const respuesta = await fetch('https://inf281-production.up.railway.app/eventos');
        const data = await respuesta.json();

        // Filtrar eventos según la categoría seleccionada (Auxcategoria)
        const eventosFiltrados = data.filter(evento => 
          evento.CategoriasEvento.some(categoria => categoria.categoria.nombre === Auxcategoria)
        );

        setEventos(eventosFiltrados);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setCarga(false);
      }
    };

    fetchEventos();
  }, [Auxcategoria]);

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

  // Manejar la inscripción al evento
  const handleInscripcion = async (eventoId) => {
    const id_usuario = localStorage.getItem('id_user');
    if (!id_usuario) {
      alert('❌ No se encontró el ID del usuario. Por favor inicia sesión.');
      return;
    }

    try {
      const res = await fetch('https://inf281-production.up.railway.app/agenda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario,
          id_evento: eventoId,
        }),
      });

      if (!res.ok) throw new Error('Error al registrar inscripción');

      const data = await res.json();
      alert(data.mensaje);
            // Actualizar el estado de inscripción en `localStorage` y en el estado local
      const updatedInscripciones = { ...inscripciones, [eventoId]: true };
      updateInscripcionesInLocalStorage(updatedInscripciones);
    } catch (error) {
      console.error(error);
      alert('❌ Ocurrió un error al registrar la inscripción.');
    }
  };

  // Manejar la desinscripción del evento
  const handleDesinscripcion = async (eventoId) => {
    const id_usuario = localStorage.getItem('id_user');
    if (!id_usuario) {
      alert('❌ No se encontró el ID del usuario. Por favor inicia sesión.');
      return;
    }

    try {
      const res = await fetch(`https://inf281-production.up.railway.app/agenda/${id_usuario}/${eventoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario,
          id_evento: eventoId,
        }),
      });

      if (!res.ok) throw new Error('Error al desinscribir');

      const data = await res.json();
      alert(data.mensaje);

            // Actualizar el estado de inscripción en `localStorage` y en el estado local
      const updatedInscripciones = { ...inscripciones, [eventoId]: false };
      updateInscripcionesInLocalStorage(updatedInscripciones);
    } catch (error) {
      console.error(error);
      alert('❌ Ocurrió un error al desinscribir.');
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-white text-2xl font-semibold text-center p-4">
        EVENTOS EN CATEGORÍA {Auxcategoria.toUpperCase()}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventos.map((ev) => (
          <div key={ev.id_evento} className="bg-white p-2 rounded shadow">
            <h4 className="font-semibold text-center p-4">{ev.titulo}</h4>
            <img
              src={ev.foto_evento}
              alt={ev.titulo}
              width={400}
              height={250}
              className="rounded mx-auto"
            />
            <p className="text-sm text-gray-600 p-4">{ev.descripcion}</p>
            <p className="text-sm text-gray-700 p-4">
              <strong>Fecha: </strong>{new Date(ev.hora_inicio).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 p-4">
              <strong>Hora: </strong>{new Date(ev.hora_inicio).toLocaleTimeString()} - {new Date(ev.hora_fin).toLocaleTimeString()}
            </p>
            <p className="text-sm text-gray-700 p-4">
              <strong>Modalidad: </strong>{ev.modalidad}
            </p>

            {/* Mostrar los Expositores */}
            <div className="text-sm text-gray-600 p-4">
              <strong>Expositores:</strong>
              {ev.Expositores.map((expositor) => (
                <div key={expositor.id_expositor}>
                  <span>{expositor.nombre} ({expositor.especialidad})</span>
                </div>
              ))}
            </div>

            {/* Mostrar los Patrocinadores */}
            <div className="text-sm text-gray-700 p-4">
              <strong>Patrocinadores:</strong>
              {ev.Eventos_Patrocinadores.map((patrocinador) => (
                <div key={patrocinador.id_patrocina}>
                  <span>{patrocinador.Patrocinadores.razon_social}</span>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4 py-4">
              <button
                onClick={() => inscripciones[ev.id_evento] ? handleDesinscripcion(ev.id_evento) : handleInscripcion(ev.id_evento)}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400"
              >
                {inscripciones[ev.id_evento] ? "DESAGENDAR" : "AGENDAR"}
              </button>
              <Link
                href={`/eventos/vermas/${ev.id_evento}/`}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400"
              >
                VER MÁS
              </Link>
              {userRole === 'admin' && (
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
