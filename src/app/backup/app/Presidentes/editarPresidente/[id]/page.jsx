// app/Presidentes/editar/[id]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correcto para navegación en el cliente
import { allPresidentes } from '../../../data/presidentes';

export default function EditarPresidente({ params }) {
  const router = useRouter();
  const { id } = params;
  const [presidente, setPresidente] = useState(null);
  const [nombre, setNombre] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState('');
  


  useEffect(() => {
    if (id) {
      const presidenteData = allPresidentes.find(p => p.id == id);
      if (presidenteData) {
        setPresidente(presidenteData);
        setNombre(presidenteData.nombre);
        setPeriodo(presidenteData.periodo);
        setDescripcion(presidenteData.descripcion);
        setFoto(presidenteData.foto);
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Actualizar el objeto del presidente dentro del estado local
    const updatedPresidente = { ...presidente, nombre, periodo, descripcion, foto };

    // Buscar y reemplazar el presidente actualizado en la lista
    const updatedPresidentes = allPresidentes.map(p =>
      p.id === presidente.id ? updatedPresidente : p
    );

    // Actualizar la lista de presidentes en memoria
    // Nota: Aquí necesitarías actualizar el estado global o backend, pero para este ejemplo, estamos trabajando solo con memoria

    alert(`Datos del presidente ${nombre} actualizados`);
    // Redirigir al listado de presidentes
    router.push('/Presidentes'); // Redirige a la página de Presidentes
  };

  if (!presidente) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Editar Presidente</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-semibold">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="periodo" className="block text-sm font-semibold">Periodo</label>
          <input
            type="text"
            id="periodo"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-semibold">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="foto" className="block text-sm font-semibold">Foto URL</label>
          <input
            type="text"
            id="foto"
            value={foto}
            onChange={(e) => setFoto(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
}
