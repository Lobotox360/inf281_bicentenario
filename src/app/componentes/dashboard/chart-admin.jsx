'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoBarras() {
  const [datosDepartamentos, setDatosDepartamentos] = useState({});
  const departamentos = [
    'La Paz', 'Oruro', 'Cochabamba', 'Santa Cruz',
    'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'
  ];

  useEffect(() => {
    const fetchDatosPorDepartamento = async () => {
      try {
        const departamentosDatos = {};
        for (const departamento of departamentos) {
          const res = await fetch(`https://inf281-production.up.railway.app/dashboard/departamento/${departamento}`, {
            method: 'GET',
          });

          if (!res.ok) {
            throw new Error(`Error al obtener los datos de ${departamento}`);
          }

          const datos = await res.json();
          departamentosDatos[departamento] = datos;
        }

        setDatosDepartamentos(departamentosDatos);

      } catch (error) {
        toast.error('Error del servidor');
      }
    };

    fetchDatosPorDepartamento();
  }, []);

  const datos = {
    labels: ['LP', 'OR', 'PT', 'CB', 'SC', 'BE', 'PA', 'TJ', 'CH'],
    datasets: [
      {
        label: 'Nro agendados',
        data: [datosDepartamentos['La Paz']?.nro_personas_agendas || 0,
            datosDepartamentos['Oruro']?.nro_personas_agendas || 10,
            datosDepartamentos['Potosí']?.nro_personas_agendas || 20,
            datosDepartamentos['Cochabamba']?.nro_personas_agendas || 30,
            datosDepartamentos['Santa Cruz']?.nro_personas_agendas || 40,
            datosDepartamentos['Beni']?.nro_personas_agendas || 30,
            datosDepartamentos['Pando']?.nro_personas_agendas || 10,
            datosDepartamentos['Chuquisaca']?.nro_personas_agendas || 20,
            datosDepartamentos['Tarija']?.nro_personas_agendas || 10
          ], 
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: 'Puntuacion promedio',
        data: [datosDepartamentos['La Paz']?.puntuacion_promedio || 0,
            datosDepartamentos['Oruro']?.puntuacion_promedio || 20,
            datosDepartamentos['Potosí']?.puntuacion_promedio || 10,
            datosDepartamentos['Cochabamba']?.puntuacion_promedio || 20,
            datosDepartamentos['Santa Cruz']?.puntuacion_promedio || 10,
            datosDepartamentos['Beni']?.puntuacion_promedio || 20,
            datosDepartamentos['Pando']?.puntuacion_promedio || 50,
            datosDepartamentos['Chuquisaca']?.puntuacion_promedio || 10,
            datosDepartamentos['Tarija']?.puntuacion_promedio || 50
          ], 
        backgroundColor: 'rgba(192, 79, 75, 0.6)',
      },
      {
        label: 'Nro eventos realizado',
        data: [datosDepartamentos['La Paz']?.nro_eventos_realizados || 0,
            datosDepartamentos['Oruro']?.nro_eventos_realizados || 12,
            datosDepartamentos['Potosí']?.nro_eventos_realizados || 13,
            datosDepartamentos['Cochabamba']?.nro_eventos_realizados || 25,
            datosDepartamentos['Santa Cruz']?.nro_eventos_realizados || 19,
            datosDepartamentos['Beni']?.nro_eventos_realizados || 2,
            datosDepartamentos['Pando']?.nro_eventos_realizados || 6,
            datosDepartamentos['Chuquisaca']?.nro_eventos_realizados || 1,
            datosDepartamentos['Tarija']?.nro_eventos_realizados || 52
          ], 
        backgroundColor: 'rgba(231, 224, 20, 0.6)',
      },
    ],
  };

  // Configuración de opciones para hacer el gráfico responsivo
  const opciones = {
    responsive: true, 
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Estadísticas por departamento (Barras)</h3>
      <div className="w-full" style={{ height: '400px' }}>
        <Bar data={datos} options={opciones} />
      </div>
      <ToastContainer />
    </div>
  );
}
