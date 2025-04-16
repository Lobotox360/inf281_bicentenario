'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function RestablecerPassword() {
  const [password, setPassword] = useState('');
  const [repetir, setRepetir] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null); // Local state to hold the token

  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  // Using useEffect to safely fetch query parameters on the client side
  useEffect(() => {
    const searchParams = useSearchParams();
    const tokenFromParams = searchParams.get('token');
    if (!tokenFromParams) {
      setMensaje('❌ Token no válido o expirado.');
    } else {
      setToken(tokenFromParams); // Set the token only when available
    }
  }, []);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Validación de la contraseña
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!regex.test(newPassword)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return;

    if (password !== repetir) {
      setMensaje('❌ Las contraseñas no coinciden');
      return;
    }

    if (error) {
      setMensaje('❌ Por favor, corrige los errores en la contraseña.');
      return;
    }

    setLoading(true);
    setMensaje('');

    const res = await fetch('https://inf281-production.up.railway.app/login/cambiar-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        nuevaContrasena: password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje('✅ Contraseña actualizada correctamente');
      setTimeout(() => router.push('/login'), 3000); // Redirige después de 3 segundos
    } else {
      setMensaje('❌ Error: ' + (data.message || 'No se pudo cambiar la contraseña'));
    }

    setLoading(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
                    value={password}
                    onChange={handlePasswordChange}
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
                  value={repetir}
                  onChange={(e) => setRepetir(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded"
                  placeholder="********"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded font-semibold text-white ${
                  loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                } mt-2`}
              >
                {loading ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </form>
          )}

          {mensaje && (
            <p className={`mt-4 font-semibold ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </Suspense>
  );
}
