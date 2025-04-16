'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const EditarEvento = ({ eventoId }) => {
  const router = useRouter();

  return (
    <div>
      <h1 className='text-white text-3xl font-semibold text-center p-4'>BIENVENIDO ADMINISTRADOR DE EVENTOS</h1>
      <h3 className='text-white text-3xl font-semibold text-center p-4'>ELEGI LA(S) OPCION(ES) QUE QUIERES EDITAR DEL EVENTO</h3>
      <div className='flex items-center justify-center bg-white max-w-4xl mx-auto rounded-full'>FOTO DEL EVENTO</div>
      {/* Contenedores de bloques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div className="bg-orange-400 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-400">
          <Link href={`/eventos/editar/${eventoId}/informacion`}>
            <h3 className="text-white text-center text-xl font-semibold">Editar información del Evento</h3>
          </Link>
        </div>
        <div className="bg-orange-400 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-400">
          <Link href={`/eventos/editar/${eventoId}/patrocinadores`}>
            <h3 className="text-white text-center text-xl font-semibold">Editar patrocinadores</h3>
          </Link>
        </div>
        <div className="bg-orange-400 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-400">
          <Link href={`/eventos/editar/${eventoId}/expositores`}>
            <h3 className="text-white text-center text-xl font-semibold">Editar expositores</h3>
          </Link>
        </div>
        <div className="bg-orange-400 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-400">
          <Link href={`/eventos/editar/${eventoId}/categorias`}>
            <h3 className="text-white text-center text-xl font-semibold">Editar categorías</h3>
          </Link>
        </div>
        <div className="bg-orange-400 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-400">
          <Link href={`/eventos/editar/${eventoId}/telefonos`}>
            <h3 className="text-white text-center text-xl font-semibold">Editar teléfonos</h3>
          </Link>
        </div>
        <div className="bg-orange-400 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-400">
          <Link href={`/eventos/editar/${eventoId}/ubicacion`}>
            <h3 className="text-white text-center text-xl font-semibold">Editar ubicación</h3>
          </Link>
        </div>
        
        {/* Último bloque centrado */}
        <div className="bg-orange-400 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-400 col-span-1 md:col-span-2 lg:col-span-3">
          <Link href={`/eventos/editar/${eventoId}/foto`}>
            <h3 className="text-white text-center text-xl font-semibold">Editar foto</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditarEvento;
