'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubirFoto() {
  const [formData, setFormData] = useState({
    email: '',
    selectedFile: null,
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, selectedFile: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    const { email, selectedFile } = formData;
    if (!selectedFile || !email) return;

    setLoading(true);
    setMensaje('');

    const uploadData = new FormData();
    uploadData.append('foto', selectedFile);
    uploadData.append('email', email);

    try {
      const res = await fetch('https://inf281-production.up.railway.app/usuario/foto', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('✅ Imagen subida con éxito');
        setTimeout(() => router.push('/login'), 3000); // redirige después de 3 segundos
      } else {
        setMensaje('❌ Error: ' + (data.message || 'Algo falló'));
      }
    } catch (error) {
      setMensaje('❌ Error: Hubo un problema al intentar subir la foto.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-yellow-400 to-lime-400 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-80 text-center">
        <h2 className="text-red-600 text-xl font-bold mb-3">¿Subir foto de perfil?</h2>

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-4 border rounded text-gray-700"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="mb-4 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
        />

        {formData.selectedFile && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(formData.selectedFile)}
              alt="preview"
              className="mx-auto w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !formData.selectedFile || !formData.email}
          className={`w-full py-2 px-4 rounded font-semibold text-white ${
            formData.selectedFile && formData.email && !loading
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-gray-300 cursor-not-allowed'
          } mb-2`}
        >
          {loading ? 'Subiendo...' : 'Subir foto'}
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-2 px-4 rounded font-semibold text-white bg-gray-500 hover:bg-gray-600"
        >
          Saltar
        </button>

        {mensaje && (
          <p className={`mt-4 font-semibold ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
