import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Link from 'next/link';

const VistaCategoriaEventos = ({ userRole = 'admin', Auxcategoria }) => {
  const [eventos, setEventos] = useState([]);
  const [carga, setCarga] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        // Llamada a la API para obtener todos los eventos
        const respuesta = await fetch('https://inf281-production.up.railway.app/eventos');
        const data = await respuesta.json();

        // Filtramos los eventos según la categoría seleccionada (Auxcategoria)
        const eventosFiltrados = data.filter(evento => {
          return evento.CategoriasEvento.some(categoria => categoria.categoria.nombre === Auxcategoria);
        });

        setEventos(eventosFiltrados); // Guardamos los eventos filtrados en el estado
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setCarga(false); // Finaliza el estado de carga
      }
    };

    fetchEventos(); // Llamamos a la función de obtención de eventos
  }, [Auxcategoria]); // Dependencia: cuando 'Auxcategoria' cambia, vuelve a ejecutar el efecto

  // Si está cargando los eventos
  if (carga) {
    return <p className='text-center text-white text-xl font-semibold'>Cargando eventos...</p>;
  }

  // Si no hay eventos en esa categoría
  if (eventos.length === 0) {
    return <p className='text-center text-white text-xl font-semibold'>No hay eventos disponibles para la categoría {Auxcategoria}.</p>;
  }

  return (
    <div className="space-y-10">
      <h2 className="text-white text-2xl font-semibold text-center p-4">
        EVENTOS EN CATEGORÍA {Auxcategoria.toUpperCase()}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mostrar los eventos de la categoría seleccionada */}
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


            <div className="flex justify-center space-x-4 py-4">
              {/* Botón asistir */}
              <button
                onClick={() => handleAsistir(ev.id_evento)}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400"
              >
                ASISTIR
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

export default VistaCategoriaEventos;
