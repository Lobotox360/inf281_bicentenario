import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registramos los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Torta({ var1, var2, var3, titulo, tag1, tag2, tag3 }) {
  // Datos del gráfico
  const data = {
    labels: [tag1, tag2, tag3],
    datasets: [
      {
        data: [var1, var2, var3],
        backgroundColor: ['#3b82f6', '#FFC107','#4CAF50'], 
        borderWidth: 0,
      },
    ],
  };

  

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center">
      <h2 className="text-xl text-center font-semibold mb-4">{titulo}</h2>
        <Pie data={data} />
    </div>
  );
}
