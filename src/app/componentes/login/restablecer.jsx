'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

function ObtenerToken() {
  const [contrasena, setContrsena] = useState('');
  const [repetirContra, setRepetirContra] = useState('');
  const [cargando, setCargando] = useState(false);
  const [token, setToken] = useState(null); 
  const parametros = useSearchParams();
  const router = useRouter();
  const [visibleNueva, setVisibleNueva] = useState(false);
  const [visibleRepetir, setVisibleRepetir] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tokenParametro = parametros.get('token');
    if (!tokenParametro) {
      toast.error('Token no válido o expirado.');
    } else {
      setToken(tokenParametro);
    }
  }, []);

  const handleCambiarContrasena = (e) => {
    const nuevaContra = e.target.value;
    setContrsena(nuevaContra);

    const validarContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!validarContrasena.test(nuevaContra)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
    } else {
      setError('');
      toast.dismiss();  
    }
  };

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
                <div className="relative">
                  <input
                    type={visibleNueva ? 'text' : 'password'}
                    value={contrasena}
                    onChange={handleCambiarContrasena}
                    required
                    className="w-full px-3 py-2 border rounded pr-10"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setVisibleNueva(!visibleNueva)}
                    className="cursor-pointer absolute right-3 top-2.5 text-xl text-gray-600"
                  >
                    {visibleNueva ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </div>
              </div>

              <div className="text-left mb-4 relative">
                <label className="block text-sm font-semibold mb-1">Repetir contraseña:</label>
                <div className="relative">
                  <input
                    type={visibleRepetir ? 'text' : 'password'}
                    value={repetirContra}
                    onChange={(e) => setRepetirContra(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded pr-10"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setVisibleRepetir(!visibleRepetir)}
                    className="cursor-pointer absolute right-3 top-2.5 text-xl text-gray-600"
                  >
                    {visibleRepetir ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </div>
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
        <ToastContainer />
      </div>
  );
}

export default function RestablecerPassword() {
  return (
    <Suspense>
      <ObtenerToken />
    </Suspense>
  );
}
