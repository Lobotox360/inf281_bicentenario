// /components/Chart.js

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoBarras() {
  const datos = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: '2019',
        data: [35, 50, 30, 40, 45, 55, 60, 65, 70],
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: '2020',
        data: [30, 45, 40, 50, 60, 70, 80, 90, 100],
        backgroundColor: 'rgba(255,99,132,0.6)',
      },
    ],
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Resultados</h3>
      <Bar data={datos} />
    </div>
  );
}
