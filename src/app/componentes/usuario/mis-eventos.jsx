'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MisEventos = () => {
  const [usuario, setUsuario] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [carga, setCarga] = useState(true);
    

  useEffect(() => {
    const idUser = localStorage.getItem('id_user');
    if (idUser) {
      setUsuario(idUser);
    }
  }, []); 
  

  useEffect(() => {
    if (!usuario) return; 
    const fetchEventos = async () => {
      try {
        const respuesta = await fetch(`https://inf281-production.up.railway.app/eventos/evento/usuario/${usuario}`);
        const datos = await respuesta.json();
        setEventos(datos);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setCarga(false);
      }
    };

    fetchEventos();
  }, [usuario]);


  // Si está cargando los eventos
  if (carga) {
    return <p className='mt-25 text-center text-white text-xl font-semibold'>Cargando eventos...</p>;
  }

  // Si no hay eventos en esa categoría
  if (eventos.length === 0) {
    return <p className='mt-25 text-center text-white text-xl font-semibold'>No te has registrado a ningun evento.</p>;
  }

  return (
    <div className="mt-25 space-y-10 mx-20">
      <h2 className="text-white text-3xl font-semibold text-center p-4">
        MIS EVENTOS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventos.map((ev) => (
          <div key={ev.id_evento} className="bg-white p-2 rounded shadow">
            <h4 className="font-semibold text-center p-4">{ev.titulo}</h4>
            <img
              src={ev.foto_evento}
              alt={ev.titulo}
              style={{ maxWidth: '400px', maxHeight: '250px' }}
              className="rounded mx-auto"
            />
            <p className="text-sm text-gray-600 p-2">{ev.descripcion}</p>
            <p className="text-center text-sm text-gray-700 p-2">
              <strong>Fecha: </strong>{new Date(ev.hora_inicio).toLocaleDateString()}
            </p>
            <p className="text-center text-sm text-gray-700 p-2">
              <strong>Hora: </strong>{new Date(ev.hora_inicio).toLocaleTimeString()} - {new Date(ev.hora_fin).toLocaleTimeString()}
            </p>
            <p className="text-center text-sm text-gray-700 p-2">
              <strong>Modalidad: </strong>{ev.modalidad}
            </p>

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4 py-4">
              <Link
                href={`/eventos/vermas/${ev.id_evento}/`}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400"
              >
                VER MÁS
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisEventos;
