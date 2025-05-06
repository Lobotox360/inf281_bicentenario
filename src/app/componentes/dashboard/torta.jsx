import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registramos los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Torta({ porcentaje, titulo }) {
  // Datos del gráfico
  const data = {
    labels: [],
    datasets: [
      {
        data: [porcentaje, 100 - porcentaje],
        backgroundColor: ['#3b82f6', '#e5e7eb', '#e5e7ed'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center w-full">
      <h2 className="text-xl text-center font-semibold mb-4">{titulo}</h2>
      <div className="relative w-40 h-40">
        <Pie data={data} />
        <p className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-semibold text-center">
          {porcentaje}%
        </p>
      </div>
    </div>
  );
}
