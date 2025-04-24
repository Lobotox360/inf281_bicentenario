import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function BarraHistorial({ historial = [] }) {
  const [abierto, setAbierto] = useState(true);

  return (
    <div
      className={`mt-20 fixed top-0 left-0 h-full transition-transform duration-300 bg-white/20 text-white backdrop-blur-lg shadow-lg z-50 ${
        abierto ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "300px" }}
    >
      <button
        onClick={() => setAbierto(!abierto)}
        className="absolute right-[-50px] cursor-pointer bg-transparent text-blue-600 px-4 py-4 shadow-md hover:bg-blue-100"
      >
        {abierto ? <FaArrowLeft/> : <FaArrowRight/>}
      </button>

      <div className="p-4 overflow-y-auto h-full">
        <h2 className="text-xl font-bold mb-4 border-b border-white/30 pb-2">Historial</h2>
        {historial.length === 0 ? (
          <p className="text-sm italic text-gray-200">Sin preguntas todavía...</p>
        ) : (
          <ul className="space-y-2">
            {historial.map((item, index) => (
              <li key={index} className="bg-white/10 p-2 rounded-lg">
                <p className="font-semibold">{item.pregunta}</p>
                <p className="text-sm text-gray-200">{item.respuesta}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
