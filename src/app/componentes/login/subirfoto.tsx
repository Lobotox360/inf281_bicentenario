'use client';
//mejorar
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubirFoto() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !email) return;

    const formData = new FormData();
    formData.append('foto', selectedFile); // <-- nombre exacto esperado por tu backend
    formData.append('email', email);

    const res = await fetch('https://inf281-production.up.railway.app/usuario/foto', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Imagen subida con éxito');
      console.log(data);
      router.push('/login');
    } else {
      alert('❌ Error: ' + (data.message || 'Algo falló'));
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
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border rounded text-gray-700"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="mb-4 block w-full text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-semibold
                     file:bg-orange-500 file:text-white
                     hover:file:bg-orange-600"
        />

        {selectedFile && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              className="mx-auto w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || !email}
          className={`w-full py-2 px-4 rounded font-semibold text-white ${
            selectedFile && email
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'bg-gray-300 cursor-not-allowed'
          } mb-2`}
        >
          Subir foto
        </button>

        <button
          onClick={handleSkip}
          className="w-full py-2 px-4 rounded font-semibold text-white bg-gray-500 hover:bg-gray-600"
        >
          Saltar
        </button>
      </div>
    </div>
  );
}
