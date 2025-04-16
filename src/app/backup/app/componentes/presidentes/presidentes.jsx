// app/Presidentes/page.jsx

import React, { useState } from 'react';
import Carrusel from './carrusel';
import Navbar from './navbar';
import { allPresidentes } from '../../data/presidentes';

const periodos = [
  { label: "1980 - 1995", desde: 1980, hasta: 1995 },
  { label: "1995 - 2010", desde: 1995, hasta: 2010 },
  { label: "2010 - 2025", desde: 2010, hasta: 2025 },
];

export default function ListaPresidentes() {
  const [rango, setRango] = useState(periodos[0]);

  const presidentesFiltrados = allPresidentes.filter(p => {
    const anioInicio = parseInt(p.periodo.split("-")[0]);
    return anioInicio >= rango.desde && anioInicio <= rango.hasta;
  });

  return (
    <div>
      <Navbar />
      <h2 className='text-center text-5xl font-extrabold text-white'>PRESIDENTES DE BOLIVIA</h2>
      <div className="flex justify-end max-w-6xl mx-auto">
        <select
          className="border border-gray-300 rounded px-3 py-3 text-white"
          value={rango.label}
          onChange={(e) => {
            const seleccionado = periodos.find(p => p.label === e.target.value);
            setRango(seleccionado);
          }}
        >
          {periodos.map((p) => (
            <option className='text-black' key={p.label} value={p.label}>{p.label}</option>
          ))}
        </select>
      </div>

      <Carrusel presidentes={presidentesFiltrados} />
    </div>
  );
}
