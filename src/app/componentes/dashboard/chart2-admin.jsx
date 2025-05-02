// /components/Chart.js

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los elementos necesarios
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function GraficoLineal() {
  const datos = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: '2019',
        data: [35, 50, 30, 40, 45, 55, 60, 65, 70],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,  // Asegúrate de que no se llene el área bajo la línea
        tension: 0.1  // Controla la curva de la línea (si es necesaria)
      },
      {
        label: '2020',
        data: [30, 45, 40, 50, 60, 70, 80, 90, 100],
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: false,
        tension: 0.1
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Resultados</h3>
        <Line data={datos} />
    </div>
  );
}
