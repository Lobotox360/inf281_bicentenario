'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';import 'aos/dist/aos.css';

const MisEventos = () => {
  const [usuario, setUsuario] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [carga, setCarga] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setToken(token);
    const idUser = localStorage.getItem('id_user');
    if (idUser) {
      setUsuario(idUser);
    }
  }, []); 

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (!usuario) return;
    const fetchEventos = async () => {
      try {
        if (!token) {throw new Error("Acceso denegado");}
        const respuesta = await fetch(`https://inf281-production.up.railway.app/eventos/evento/usuario/${usuario}`, {headers: {"Authorization": `Bearer ${token}`}});
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
    console.log(eventos.length);
    return <p className='mt-25 text-center text-white text-xl font-semibold'>Cargando eventos...</p>;
  }

  // Si no hay eventos
  if (!Array.isArray(eventos) || eventos.length === 0) {
    return <p className='mt-25 text-center text-white text-xl font-semibold'>No te has registrado a ningun evento.</p>;
  }

  return (
    <div className="sm:mx-10 mb-4">
      <h2 className="text-white text-3xl font-semibold text-center p-4" data-aos="fade-up">
        MIS EVENTOS
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eventos.map((ev) => (
          <div key={ev.id_evento} className="flex flex-col justify-between bg-gradient-to-r from-yellow-400 to-green-500 p-4 rounded-lg shadow-md h-full"  data-aos="fade-up">
            <h4 className="font-semibold text-center p-4">{ev.titulo}</h4>
            <img
              src={ev.foto_evento}
              alt={ev.titulo}
              style={{ maxWidth: '400px', maxHeight: '250px' }}
              className="rounded mx-auto"
            />
            <p className="text-center text-gray-600 p-2">{ev.descripcion}</p>
            <p className="text-center text-sm text-gray-700 p-2">
              <strong>📅Fecha: </strong>{new Date(ev.hora_inicio).toLocaleDateString()}
            </p>
            <p className="text-center text-sm text-gray-700 p-2">
              <strong>⏰Hora: </strong>{new Date(ev.hora_inicio).toLocaleTimeString()} - {new Date(ev.hora_fin).toLocaleTimeString()}
            </p>
            <p className="text-center text-sm text-gray-700 p-2">
              <strong>🖥️Modalidad: </strong>{ev.modalidad}
            </p>

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4 py-4">
              <Link
                href={`/eventos/vermas/${ev.id_evento}/`}
                className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400 mt-auto"
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
