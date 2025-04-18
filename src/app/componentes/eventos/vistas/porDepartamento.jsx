'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';

const VistaDepartamentoEventos = ({ userRole = 'admin', departamento }) => {
  const [eventos, setEventos] = useState([]);
  const [carga, setCarga] = useState(true);

  // Leer inscripciones desde localStorage (si existen)
  const [inscripciones, setInscripciones] = useState(() => {
    const storedInscripciones = localStorage.getItem('inscripciones');
    return storedInscripciones ? JSON.parse(storedInscripciones) : {};
  });
  

  const updateInscripcionesInLocalStorage = (updatedInscripciones) => {
    localStorage.setItem('inscripciones', JSON.stringify(updatedInscripciones));
    setInscripciones(updatedInscripciones); // Actualiza el estado local también
  };

  useEffect(() => {
    // Llamada a la API para obtener los eventos
    const fetchEventos = async () => {
      try {
        const respuesta = await fetch('https://inf281-production.up.railway.app/eventos');
        const datos = await respuesta.json();
        setEventos(datos);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      } finally {
        setCarga(false);
      }
    };

    fetchEventos();
  }, []); 

  useEffect(() => {
    // Guardar inscripciones en localStorage cuando cambien
    if (Object.keys(inscripciones).length > 0) {
      localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
    }
  }, [inscripciones]);

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

      // Actualizar estado de inscripciones en el estado local y en localStorage
      const updatedInscripciones = { ...inscripciones, [eventoId]: false };
      updateInscripcionesInLocalStorage(updatedInscripciones);
    } catch (error) {
      console.error(error);
      alert('❌ Ocurrió un error al desinscribir.');
    }
  };

  // Filtrar los eventos según el departamento seleccionado
  const eventosDepartamento = eventos.filter(evento => evento.Ubicacion?.departamento === departamento);

  if (carga) {
    return <p className='text-center text-white text-xl font-semibold'>Cargando eventos...</p>;
  }

  if (eventosDepartamento.length === 0) {
    return <p className='text-center text-white text-xl font-semibold'>No hay eventos disponibles en {departamento}</p>;
  }

  return (
    <div className="space-y-10">
      <h2 className="text-white text-2xl font-semibold text-center p-4">
        EVENTOS EN {departamento.toUpperCase()}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventosDepartamento.map((ev) => (
          <div key={ev.id_evento} className="bg-white p-2 rounded shadow">
            <h4 className="font-semibold text-center p-4">{ev.titulo}</h4>
            <Image
              src={ev.foto_evento}
              alt={ev.titulo}
              width={400}
              height={250}
              className="rounded mx-auto"
            />
            <p className="text-sm text-gray-700 p-4">{ev.descripcion}</p>

            <p className="text-sm text-gray-700 p-4">
              <strong>Fecha: </strong>{new Date(ev.hora_inicio).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-700 p-4">
              <strong>Hora: </strong>{new Date(ev.hora_inicio).toLocaleTimeString()} - {new Date(ev.hora_fin).toLocaleTimeString()}
            </p>
            <p className="text-sm text-gray-700 p-4">
              <strong>Modalidad: </strong>{ev.modalidad}
            </p>

            <div className="flex justify-center space-x-4 py-4">
              {/* Botón asistir */}
              <button
                onClick={() => inscripciones[ev.id_evento] ? handleDesinscripcion(ev.id_evento) : handleInscripcion(ev.id_evento)}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400"
              >
                {inscripciones[ev.id_evento] ? "DESAGENDAR" : "AGENDAR"}
              </button>

              {/* Enlace ver más */}
              <Link
                href={`/eventos/vermas/${ev.id_evento}/`}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400"
              >
                VER MÁS
              </Link>

              {/* Si el usuario es admin, mostrar el botón de edición */}
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

export default VistaDepartamentoEventos;
