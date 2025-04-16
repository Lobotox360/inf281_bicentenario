'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EditarFotoEvento = ({anteriorPaso, eventoId }) => {
  const [imagen, setImagen] = useState(null);  // Mantener la imagen desde los datos previos
  const [imagenPreview, setImagenPreview] = useState(null); // Para la vista previa
  const router = useRouter();
  useEffect(() => {
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`);
        const data = await response.json();
        console.log(data);
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

  // Manejo de cambios para la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file)); // Vista previa de la imagen
    }
  };

  // Manejo del envío de los datos finales
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(informacion),
      });

      if (response.ok) {
        alert('✅ Evento actualizado exitosamente');
        siguientePaso();  // Avanzar al siguiente paso si la actualización es exitosa
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
      <form className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 5: Agregar Imagen del Evento</h3>

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
        <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleBack}
              className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-400"
            >
              Salir sin guardar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Guardar cambios y salir
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditarFotoEvento;
