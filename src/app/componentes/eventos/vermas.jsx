'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/app/componentes/inicio/navbar';
import Link from 'next/link';
import MapaEvento from './vistas/mapa';
import ModuloComentarios from './vistas/comentarios-carrusel';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerMasEvento() {
  const { id: eventoId } = useParams();
  const [evento, setEvento] = useState(null);
  const [agendado, setAgendado] = useState([]);
  const [yaAgendado, setYaAgendado] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);
  const [token, setToken] = useState(null); // Use state to handle token

  useEffect(() => {
    // Check if we are in the client side before accessing localStorage
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      setToken(storedToken);

      const storedId = localStorage.getItem('id_user');
      if (storedId) {
        setIdUsuario(storedId);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`);
        const data = await response.json();
        setEvento(data);
      } catch (error) {
        console.error('Error al obtener evento:', error);
        toast.error('Error al obtener el evento.');
      }
    };

    if (eventoId) {
      fetchEvento();
    }
  }, [eventoId]);

  useEffect(() => {
    if (idUsuario && token) {
      const fetchAgenda = async () => {
        try {
          const response = await fetch(`https://inf281-production.up.railway.app/agenda/${idUsuario}`, {
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setAgendado(data);
          } else {
            console.error('No hay datos en la agenda de este usuario');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          toast.error('Error al obtener tu agenda.');
        }
      };

      fetchAgenda();
    }
  }, [idUsuario, token]);

  useEffect(() => {
    if (eventoId && agendado.length > 0) {
      const eventoActual = agendado.find(evento => String(evento.id_evento) === String(eventoId));
      setYaAgendado(Boolean(eventoActual));
    }
  }, [eventoId, agendado]);

  if (!evento) {
    return <p className="mt-30 text-center text-white text-xl font-semibold">Cargando evento...</p>;
  }

  const hora_inicio = String(new Date(evento?.hora_inicio).getHours()).padStart(2, '0') + ':' + String(new Date(evento?.hora_inicio).getMinutes()).padStart(2, '0');
  const hora_fin = String(new Date(evento?.hora_fin).getHours()).padStart(2, '0') + ':' + String(new Date(evento?.hora_fin).getMinutes()).padStart(2, '0');
  const fecha = `${['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][new Date(evento?.hora_inicio).getDay()]}, ${new Date(evento?.hora_inicio).getDate()} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][new Date(evento?.hora_inicio).getMonth()]} de ${new Date(evento?.hora_inicio).getFullYear()}`;
  const estrellas = Array.from({ length: 5 }, (_, index) => {return index < evento.puntuacion ? '⭐' : '☆';}).join(' ');

  const handleInscripcion = async (eventoId) => {
    if (!idUsuario) {
      toast.error('Debes iniciar sesión para poder agendar un evento.');
      return;
    }

    try {
      if (!token) {
        throw new Error("Acceso denegado");
      }

      const res = await fetch('https://inf281-production.up.railway.app/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          id_usuario: idUsuario,
          id_evento: parseInt(eventoId),
        }),
      });

      if (!res.ok) throw new Error('Error al registrar inscripción');

      const data = await res.json();
      toast.success(data.mensaje);
      setTimeout(() => { window.location.reload() }, 3000);
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al registrar la inscripción.');
    }
  };

  const handleDesinscripcion = async (eventoId) => {
    if (!idUsuario) {
      toast.error('No se encontró el ID del usuario. Por favor inicia sesión.');
      return;
    }

    try {
      if (!token) {
        throw new Error("Acceso denegado");
      }

      const res = await fetch(`https://inf281-production.up.railway.app/agenda/${idUsuario}/${eventoId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          id_usuario: idUsuario,
          id_evento: eventoId,
        }),
      });

      if (!res.ok) throw new Error('Error al desinscribir');

      const data = await res.json();
      toast.warning(data.mensaje);
      setTimeout(() => { window.location.reload() }, 3000);
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error al desinscribir.');
    }
  };

  return (
    <div className="py-35">
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 text-center">{evento.titulo}</h1>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Image
            src={evento.foto_evento}
            alt={evento.titulo}
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          
          <div className="text-gray-700 text-lg">
            <p className="mb-4"><strong>Descripción:</strong> {evento.descripcion}</p>
            <p className="mb-4"><strong>Fecha:</strong> {fecha} a la(s) {hora_inicio} a {hora_fin}</p>
            <p className="mb-4"><strong>Costo:</strong> {evento.costo} Bs. <strong>Modalidad:</strong> {evento.modalidad} </p>
            <p className="mb-4 text-center"><strong>Estado:</strong> {evento.estado}</p> 
            <div>
              <h3 className="text-xl font-semibold">Categorías:</h3>
              <ul>
                {evento.CategoriasEvento.map((categoria) => (
                  <li key={categoria.id_evento_categoria} className="mb-2 text-lg">
                        <span className="ml-10 text-orange-500 font-bold">*</span> 
                        <span className="ml-2">{categoria.categoria.nombre}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Patrocinadores:</h3>
              <ul>
                {evento.Eventos_Patrocinadores.map((patrocinador) => (
                    <li key={patrocinador.Patrocinadores.id_patrocinador} className="mb-2 text-lg">
                        <span className="text-orange-500 font-bold">*</span> 
                        <span className="ml-2">{patrocinador.Patrocinadores.institucion} - {patrocinador.Patrocinadores.razon_social}</span> 
                    </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Expositores:</h3>
              <ul>
                {evento.Expositores.map((expositor) => (
                    <li key={expositor.id_expositor} className="mb-2 text-lg">
                        <span className="text-orange-500 font-bold">*</span> 
                        <span className="ml-2">{expositor.nombre} especialista en {expositor.especialidad} de la institucion {expositor.institucion}</span> 
                    </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Telefonos de contacto:</h3>
              <ul>
                {evento.Telefonos.map((telefono) => (
                    <li key={telefono.id_telefono} className="mb-2 text-lg">
                        <span className="ml-10 text-orange-500 font-bold">*</span> 
                        <span className="ml-2">{telefono.numero}</span> 
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Link href={'../'} className="text-center cursor-pointer bg-red-500 text-white py-2 px-6 rounded-full hover:bg-orange-400">
              VOLVER
          </Link>
          {yaAgendado ? (
              <button
                  onClick={() => handleDesinscripcion(eventoId)}
                  className="text-center cursor-pointer bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-orange-300"
              >
                  DESAGENDAR
              </button>
          ) : (
              <button
                  onClick={() => handleInscripcion(eventoId)}
                  className="text-center cursor-pointer bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-300"
              >
                  AGENDAR
              </button>
          )}
          <p className='text-center'>{estrellas}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-4">
        <MapaEvento latitud={evento.Ubicacion.latitud} longitud={evento.Ubicacion.longitud} direccion={evento.Ubicacion.Ubicacion}/>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-5 m-4 rounded-lg shadow-lg p-4 mb-4">
        <ModuloComentarios eventoId={eventoId}/>
      </div>
      <ToastContainer />
    </div>
  );
}
