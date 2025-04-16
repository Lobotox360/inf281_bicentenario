import React from 'react';

export default function PoliticasPresidentes({ president }) {
  if (!president) return <p className="">Selecciona un presidente para ver sus políticas clave.</p>;

  return (
    <div className="bg-white p-4 py-2 bg-cover bg-center mx-auto rounded-md max-w-3xl">
      <h2 className="text-xl font-bold">Políticas Clave: {president.nombre}</h2>
      <ul className="list-disc pl-5">
        {president.politicasClave.map((politica, idx) => (
          <li key={idx}>{politica}</li>
        ))}
      </ul>
    </div>
  );
}
