// components/Carrusel.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Carrusel({ presidentes, userRole = 'admin' }) {
  const [index, setIndex] = useState(0);
  const porPagina = 3;
  const router = useRouter();

  useEffect(() => {
    setIndex(0);
  }, [presidentes]);


  const handleEditar = (presidente) => {
    router.push(`/Presidentes/editarPresidente/${presidente.id}`);
  };
  

  const handleAgregar = () => {
    router.push('/Presidentes/agregar');
  };

  const visibles = presidentes.slice(index, index + porPagina);

  return (
    <div className="relative mt-10 px-4 flex flex-col items-center gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl w-full justify-items-center">
          {visibles.map((p, i) => (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-4 shadow-md w-72 text-center opacity-0 animate-fadeIn`}
              style={{ animationDelay: `${i * 0.3}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xl font-bold">{p.nombre}</h3>
                {userRole === 'admin' && (
                  <button onClick={() => handleEditar(p)} className="text-black hover:text-yellow-500">
                    <FaEdit size={20} />
                  </button>
                )}
              </div>
              <p className="text-gray-600">{p.periodo}</p>
              <img
                src={p.foto}
                alt={p.nombre}
                className="h-48 w-auto mx-auto object-cover rounded-lg border mt-2 mb-3"
              />
              <p className="text-sm text-gray-700">{p.descripcion}</p>
              <div className='mt-4'>              
                <Link href={`/Presidentes/vermas/${p.id}`}>
                  <span className='bg-green-500 rounded-full cursor-pointer px-4 py-2 text-white hover:bg-yellow-500'>
                    VER MÁS
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease forwards;
          }
        `}</style>
            {/* Botón agregar */}
            {userRole === 'admin' && (
        <div>
          <button
            onClick={handleAgregar}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded border border-black"
          >
            AGREGAR PRESIDENTE
          </button>
          
        </div>
      )}
    </div>
  );
}
