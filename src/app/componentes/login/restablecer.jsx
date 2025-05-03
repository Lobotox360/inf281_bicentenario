'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/router'; // Usar useRouter de Next.js
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export default function RestablecerPassword() {
  const router = useRouter();
  const [contrasena, setContrsena] = useState('');
  const [repetirContra, setRepetirContra] = useState('');
  const [cargando, setCargando] = useState(false);
  const [token, setToken] = useState(null);
  
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  // Acceder al router solo en el cliente
  useEffect(() => {
    if (router.isReady) { // Verificar si el router está listo y los parámetros están disponibles
      console.log(router.query); // Mostrar los parámetros en la consola
      const tokenParametro = router.query.token; // Extraer el token de la URL
      if (!tokenParametro) {
        toast.error('Token no válido o expirado.');
      } else {
        setToken(tokenParametro); // Si el token está presente, actualizar el estado
      }
    }
  }, [router.isReady, router.query]); // Dependencias: ejecutar cuando router esté listo o query cambia
  
  console.log(token);

  // Manejo de cambios en la contraseña
  const handleCambiarContrasena = (e) => {
    const nuevaContra = e.target.value;
    setContrsena(nuevaContra);

    // Validación de la contraseña
    const validarContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!validarContrasena.test(nuevaContra)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
    } else {
      setError('');
      toast.dismiss();  
    }
  };

  // Enviar formulario para cambiar la contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return;

    if (contrasena !== repetirContra) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (error) {
      toast.error('Por favor, corrige los errores en la contraseña.');
      return;
    }

    setCargando(true);

    const res = await fetch('https://inf281-production.up.railway.app/login/cambiar-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        nuevaContrasena: contrasena,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('Contraseña actualizada correctamente');
      setTimeout(() => router.push('/login'), 3000); 
    } else {
      toast.error('Error: ' + (data.message || 'No se pudo cambiar la contraseña'));
    }

    setCargando(false);
  };

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="min-h-screen bg-gradient-to-b from-orange-500 via-yellow-400 to-lime-400 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">🔐 Nueva contraseña</h2>
          <p className="text-gray-700 mb-4">Ingresa y confirma tu nueva contraseña segura.</p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {!token ? (
            <p className="text-red-600 font-semibold">Token inválido. Intenta nuevamente desde tu correo.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="text-left mb-4 relative">
                <label className="block text-sm font-semibold mb-1">Nueva contraseña:</label>
                <div className="flex items-center w-full">
                  <input
                    type={visible ? 'text' : 'password'}
                    value={contrasena}
                    onChange={handleCambiarContrasena}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-3"
                  >
                    {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </div>
              </div>

              <div className="text-left mb-4">
                <label className="block text-sm font-semibold mb-1">Repetir contraseña:</label>
                <input
                  type={visible ? 'text' : 'password'}
                  value={repetirContra}
                  onChange={(e) => setRepetirContra(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                disabled={cargando}
                className={`cursor-pointer w-full py-2 px-4 rounded font-semibold text-white ${cargando ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} mt-2`}
              >
                {cargando ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </Suspense>
  );
}
