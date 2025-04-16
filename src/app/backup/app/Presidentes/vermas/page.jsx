// app/presidentes/vermas/[id]/page.jsx
import React from 'react';

export default async function VerMas({ params }) {
  const { id } = params;

  // Simula fetch (reemplaza con tu fetch real o base de datos)
  const res = await fetch('http://localhost:3000/api/presidentes.json');
  const data = await res.json();
  const presidente = data.find(p => p.id === id);

  if (!presidente) return <div className="text-center mt-10">Presidente no encontrado</div>;

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
