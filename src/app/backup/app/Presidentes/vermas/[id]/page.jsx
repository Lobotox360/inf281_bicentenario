// app/presidentes/vermas/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';

export default function VerMas({ params }) {
  const { id } = params;
  const [presidente, setPresidente] = useState(null);

  useEffect(() => {
    // Simulación de fetch: reemplaza con tu endpoint real o fuente de datos
    fetch('/api/presidentes.json') // o tu API/backend
      .then(res => res.json())
      .then(data => {
        const encontrado = data.find(p => p.id === id);
        setPresidente(encontrado);
      });
  }, [id]);

  if (!presidente) return <div className="text-center mt-10">Cargando presidente...</div>;

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full border text-center">
        <h1 className="text-2xl font-bold mb-2">{presidente.nombre}</h1>
        <p className="text-gray-500 mb-4">{presidente.periodo}</p>
        <img
          src={presidente.foto}
          alt={presidente.nombre}
          className="h-72 w-auto mx-auto object-cover rounded-lg border mb-4"
        />
        <p className="text-justify text-gray-700">{presidente.descripcion}</p>
      </div>
    </div>
  );
}
