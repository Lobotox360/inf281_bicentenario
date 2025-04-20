'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/app/componentes/inicio/navbar';
import Link from 'next/link';
import MapaEvento from './mapa';

export default function VerMasEvento() {
  const { id: eventoId } = useParams();  // Obtén el id del evento desde la URL
  const [evento, setEvento] = useState(null); // Inicializa evento como null
  const [agendado, setAgendado] = useState([]);
  const [yaAgendado, setYaAgendado] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) {
      setIdUsuario(id); 
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
      }
    };

    if (eventoId) {
      fetchEvento();
    }
  }, [eventoId]);


  useEffect(() => {
    const idUsuario = localStorage.getItem('id_user')
    const fetchAgenda = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/agenda/${idUsuario}`);
        if (response.ok) {
          const data = await response.json();
          setAgendado(data); // Guardamos la respuesta en el estado
        } else {
          console.error('No hay datos en la agenda de este usuario');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } 
    };

    fetchAgenda();
  }, [idUsuario]); 

  useEffect(() => {
    if (eventoId) {
      // Aquí verificamos si el eventoId coincide con algún evento en la agenda
      const eventoActual = agendado.find(evento => String(evento.id_evento) === String(eventoId));
      if (eventoActual) {
        console.log('Evento encontrado en la agenda:');
        setYaAgendado(true);
      } else {
        console.log('No se encontró el evento en la agenda');
        setYaAgendado(false);
      }
    }
  }, [eventoId, agendado]);

  // Mostrar un mensaje de carga si el evento aún no está disponible
  if (!evento) {
    return <p className="text-center text-white text-xl font-semibold">Cargando evento...</p>;
  }

  const hora_inicio = String(new Date(evento?.hora_inicio).getHours()).padStart(2, '0') + ':' + String(new Date(evento?.hora_inicio).getMinutes()).padStart(2, '0');
  const hora_fin = String(new Date(evento?.hora_fin).getHours()).padStart(2, '0') + ':' + String(new Date(evento?.hora_fin).getMinutes()).padStart(2, '0');
  const fecha = `${['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][new Date(evento?.hora_inicio).getDay()]}, ${new Date(evento?.hora_inicio).getDate()} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][new Date(evento?.hora_inicio).getMonth()]} de ${new Date(evento?.hora_inicio).getFullYear()}`;
  const estrellas = Array.from({ length: 5 }, (_, index) => {return index < evento.puntuacion ? '⭐' : '☆';}).join(' ');

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
          id_evento: parseInt(eventoId),
        }),
      });

      if (!res.ok) throw new Error('Error al registrar inscripción');

      const data = await res.json();
      alert(data.mensaje);
      window.location.reload();
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
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('❌ Ocurrió un error al desinscribir.');
    }
  };

  
  return (
    <div className="py-35">
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 text-center">{evento.titulo}</h1>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Image
            src={evento.foto_evento}  // Suponiendo que 'image' es una propiedad del objeto evento
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
            {/* Mostrar categorías del evento */}
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
            {/* Mostrar patrocinadores del evento */}
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
            {/* Mostrar expositores del evento */}
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
            {/* Mostrar telefonos de contacto */}
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
        <div className="flex justify-between">
          <Link href={'../'} className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-orange-400">
              VOLVER
          </Link>
          <button
                onClick={() => yaAgendado ? handleDesinscripcion(eventoId) : handleInscripcion(eventoId)} 
                className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-yellow-300"
          >
            {yaAgendado ? "DESAGENDAR" : "AGENDAR"} 
          </button>
          <p>{estrellas}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-4">
        <MapaEvento latitud={evento.Ubicacion.latitud} longitud = {evento.Ubicacion.longitud} direccion={evento.Ubicacion.Ubicacion}/>
      </div>
    </div>
  );
}
