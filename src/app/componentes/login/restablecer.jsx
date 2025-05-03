'use client'; // Asegura que el código se ejecute solo en el cliente

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function RestablecerPassword() {
  const [token, setToken] = useState(null);
  const searchParams = useSearchParams(); // Obtiene los parámetros de la URL

  // UseEffect para obtener el token cuando los parámetros de búsqueda cambian
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam); // Guarda el token en el estado
    } else {
      toast.error('Token no válido o expirado.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 via-yellow-400 to-lime-400 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">🔐 Nueva contraseña</h2>
        <p className="text-gray-700 mb-4">Ingresa y confirma tu nueva contraseña segura.</p>
        
        {token ? (
          <p className="text-green-600 font-semibold">Token recibido: {token}</p>
        ) : (
          <p className="text-red-600 font-semibold">Cargando...</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RestablecerPassword />
    </Suspense>
  );
}
