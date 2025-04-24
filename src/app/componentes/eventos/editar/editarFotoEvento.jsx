'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EditarFotoEvento = ({eventoId }) => {
  const [imagen, setImagen] = useState(null);  // Mantener la imagen desde los datos previos
  const [imagenPreview, setImagenPreview] = useState(null); // Para la vista previa
  const router = useRouter();

  useEffect(() => {
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`);
        const data = await response.json();
        if (data && data.foto_evento) {
          setImagen(data.foto_evento || null);
          setImagenPreview(data.foto_evento || null);
        } else {
          console.error('No se encontraron datos del evento');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    fetchEventoData();
  }, [eventoId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {  // Verificar si es una imagen
        setImagen(file);
        setImagenPreview(URL.createObjectURL(file));
      } else {
        alert('Por favor selecciona un archivo de imagen válido.');
      }
    } else {
      setImagen(null);
      setImagenPreview(null); // Limpiar vista previa si no hay imagen
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imagen) {
      alert('❌ Por favor selecciona una imagen');
      return;
    }
  
    const formData = new FormData();
    formData.append('foto_evento', imagen);  // Cambiar 'imagen' a 'foto_evento' si es necesario
  
    try {
      const response = await fetch(`https://inf281-production.up.railway.app/eventos/foto/${eventoId}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        alert('✅ Evento actualizado exitosamente');
        router.push('/eventos');  // Redirige a la página de eventos
      } else {
        alert('❌ Error al actualizar el evento');
      }
    } catch (error) {
      console.error('❌ Error del data:', error);
      alert('❌ Error al actualizar el evento');
    }
  };
  

  const handleBack = () => {
    router.back(); // Regresa a la página anterior en el historial
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form className="bg-white p-5 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h3 className="text-2xl font-semibold text-center py-4">Editar Imagen del Evento</h3>

        {/* Input para seleccionar la imagen */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Selecciona una imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-500 hover:text-white"
          />
        </div>

        {/* Vista previa de la imagen seleccionada */}
        {imagenPreview && (
          <div className="flex justify-center mb-4">
            <img src={imagenPreview} alt="Vista previa de la imagen" className="max-w-[300px] max-h-[300px] w-full h-auto rounded-md" />
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-400"
          >
            Salir sin guardar
          </button>
          <button
            type="submit" // Cambiado a 'submit' para enviar el formulario
            className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Guardar cambios y salir
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarFotoEvento;
