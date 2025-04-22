'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight, FaEdit } from 'react-icons/fa';
import MapaEvento from './mapa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ModuloComentarios from './comentarios-carrusel';

const CarruselEventos = ({departamento }) => {
  const [eventos, setEventos] = useState([]);
  const [indexActual, setIndexActual] = useState(0);
  const [carga, setCarga] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  //Obtener Rol
  useEffect(() => {
    const role = localStorage.getItem('rol');
    setUserRole(role);
  }, []);

  // Obtener eventos
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('https://inf281-production.up.railway.app/eventos');
        const data = await response.json();
        setEventos(data);

      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setCarga(false);
      }
    };

    fetchEventos();
  }, []);

  if (carga) {
    return <p className='text-center text-white text-xl font-semibold'>Cargando eventos...</p>;
  }

  // Filtrar eventos por departamento
  const eventosDepartamento = eventos.filter(evento => evento.Ubicacion.departamento === departamento);

  // Si no hay eventos, mostrar mensaje
  if (eventosDepartamento.length === 0) {
    return (
      <p className='text-center text-white text-xl font-semibold'>No hay eventos disponibles en {departamento}.</p>
    );
  }

  const hora_inicio = String(new Date(eventosDepartamento[indexActual]?.hora_inicio).getHours()).padStart(2, '0') + ':' + String(new Date(eventosDepartamento[indexActual]?.hora_inicio).getMinutes()).padStart(2, '0');
  const hora_fin = String(new Date(eventosDepartamento[indexActual]?.hora_fin).getHours()).padStart(2, '0') + ':' + String(new Date(eventosDepartamento[indexActual]?.hora_fin).getMinutes()).padStart(2, '0');
  const fecha = `${['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][new Date(eventosDepartamento[indexActual]?.hora_inicio).getDay()]}, ${new Date(eventosDepartamento[indexActual]?.hora_inicio).getDate()} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][new Date(eventosDepartamento[indexActual]?.hora_inicio).getMonth()]} de ${new Date(eventosDepartamento[indexActual]?.hora_inicio).getFullYear()}`;

  const handleSiguiente = () => {
    setIndexActual((prevIndex) => (prevIndex + 1) % eventosDepartamento.length);
  };

  const handleAnterior = () => {
    setIndexActual((prevIndex) => (prevIndex - 1 + eventosDepartamento.length) % eventosDepartamento.length);
  };

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
      alert(data.mensaje); // Mostrar mensaje

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
      alert(data.mensaje); // Mostrar mensaje
    } catch (error) {
      console.error(error);
      alert('❌ Ocurrió un error al desinscribir.');
    }
  };

  return (
    <div className="relative p-4">
      <div className="max-w-4xl mx-auto">
        {eventosDepartamento.length > 0 && (
          <>
            <h2 className="text-white text-3xl font-semibold text-center mb-4">EVENTOS EN {departamento.toUpperCase()}</h2>
            <div key={indexActual} className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg animate-fadeIn">
              <h2 className="text-xl font-semibold text-center">{eventosDepartamento[indexActual].titulo}</h2>
              <div className="flex justify-between items-center bg-white">
                <div className="w-full px-6">
                  <p className="text-gray-600 mt-2 mx-10 text-center">{eventosDepartamento[indexActual].descripcion}</p>
                  <p className="text-gray-600 mt-2 mx-10 text-left"><strong>HORARIO: </strong> {hora_inicio} a {hora_fin}</p>
                  <p className="text-gray-600 mt-2 mx-10 text-left"><strong>FECHA: </strong> {fecha}</p>
                  <p className="text-gray-600 mt-2 mx-10 text-left"><strong>ESTADO: </strong>{eventosDepartamento[indexActual].estado} <strong>MODALIDAD: </strong>{eventosDepartamento[indexActual].modalidad}</p>
                  <p className="text-gray-600 mt-2 mx-10 text-left"><strong>COSTO: </strong>{eventosDepartamento[indexActual].costo} Bs.</p>
                </div>
                <div className="relative sm:w-3xl w-full max-w">
                  <Image src={eventosDepartamento[indexActual].foto_evento} alt="Evento" width={500} height={320} className="rounded-lg"/>
                </div>
              </div>

              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pl-4">
                <button onClick={handleAnterior} className="bg-red-500 text-white p-3 rounded-full hover:bg-yellow-500">
                  <FaArrowLeft />
                </button>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 pr-4">
                <button onClick={handleSiguiente} className="bg-red-500 text-white p-3 rounded-full hover:bg-yellow-500">
                  <FaArrowRight />
                </button>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-center space-x-4 py-4">
                <Link href={`/eventos/vermas/${eventosDepartamento[indexActual].id_evento}`} className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400">
                  VER MÁS
                </Link>
                {userRole === 'Administrador' || 'administrador_eventos' && (
                  <Link href={`/eventos/editar/${eventosDepartamento[indexActual].id_evento}`}>
                    <button className="text-yellow py-2 px-6 rounded-full hover:text-red-500">
                      <FaEdit size={20} />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center mt-8">
          <MapaEvento direccion={eventosDepartamento[indexActual]?.Ubicacion?.ubicacion} latitud={eventosDepartamento[indexActual]?.Ubicacion?.latitud} longitud={eventosDepartamento[indexActual]?.Ubicacion?.longitud} />
        </div>
        <h2 className="px-4 text-2xl font-semibold mb-4 text-white text-center">COMENTARIOS</h2>
        <div className="bg-white p-5 m-4 rounded-lg shadow-lg p-4 mb-4">
          <ModuloComentarios eventoId = {eventosDepartamento[indexActual]?.id_evento}/>
        </div>

      </div>
    </div>
  );
};

export default CarruselEventos;
