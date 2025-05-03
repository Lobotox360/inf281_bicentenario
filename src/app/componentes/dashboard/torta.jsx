

export default function Torta({ porcentaje, titulo }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center w-full">
        <h2 className="text-xl text-center font-semibold mb-4">{titulo}</h2>
        <div className="flex items-center justify-center w-24 h-24">
          {/* Contenedor del SVG para el círculo */}
          <svg className="w-full h-full transform rotate-90" viewBox="0 0 36 36">
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
              strokeDasharray={`${porcentaje}, 100`}
              d="M18 2 a16 16 0 1 1 0 32 a16 16 0 1 1 0 -32"
            />
          </svg>

          <p className="absolute text-2xl font-semibold text-center">{porcentaje}%</p>
        </div>
      </div>
    );
  }
  