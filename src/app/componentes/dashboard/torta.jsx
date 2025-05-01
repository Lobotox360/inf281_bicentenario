// /components/PercentageCircle.js

export default function PercentageCircle({ percentage }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex sm:flex-col flex-row items-center justify-center w-full">
        {/* Título dentro del mismo div */}
        <h2 className="text-xl font-semibold mb-4">Porcentaje</h2>

        {/* Contenedor del gráfico circular y porcentaje */}
        <div className="flex items-center justify-center w-24 h-24 ">
          {/* Contenedor del SVG para el círculo */}
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-300"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeDasharray="100, 100"
              d="M18 2 a16 16 0 1 1 0 32 a16 16 0 1 1 0 -32"
            />
            <path
              className="text-blue-500"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeDasharray={`${percentage}, 100`}
              d="M18 2 a16 16 0 1 1 0 32 a16 16 0 1 1 0 -32"
            />
          </svg>

          {/* Contenedor del texto centrado dentro del círculo */}
          <p className="absolute text-2xl font-semibold text-center">{percentage}%</p>
        </div>
      </div>
    );
  }
  