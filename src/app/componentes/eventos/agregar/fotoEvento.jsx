'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FotoEvento = ({ anteriorPaso, handleUpdateData, eventoData }) => {
  const [imagen, setImagen] = useState(eventoData.foto || null);
  const [imagenPreview, setImagenPreview] = useState(eventoData.foto || null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file));
      handleUpdateData('foto', file);
    }
  };

  const handleFinalSubmit = async () => {
    if (!imagen) {
      toast.error("Por favor, selecciona una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("foto_evento", imagen);
    formData.append("titulo", eventoData.informacion.titulo);
    formData.append("descripcion", eventoData.informacion.descripcion);
    formData.append("hora_inicio", eventoData.informacion.horaInicio);
    formData.append("hora_fin", eventoData.informacion.horaFin);
    formData.append("costo", eventoData.informacion.costo);
    formData.append("modalidad", eventoData.informacion.modalidad);

    formData.append("patrocinador", JSON.stringify(eventoData.patrocinadores.map(p => ({
      id_auspiciador: p.id_patrocinador
    }))));

    formData.append("expositor", JSON.stringify(eventoData.expositores));
    formData.append("categoria", JSON.stringify(eventoData.categorias.map(c => ({
      id_categoria: c.id_categoria
    }))));

    formData.append("telefonos_contacto", JSON.stringify(eventoData.telefonos));
    formData.append("ubicacion", JSON.stringify(eventoData.ubicacion));

    try {
      const res = await fetch('https://inf281-production.up.railway.app/eventos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al guardar el evento');

      await res.json();
      toast.success("Evento guardado con éxito");
      setTimeout(() => router.push('/eventos'), 2000);
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      toast.error('Ocurrió un error al guardar el evento.');
    }
  };

  return (
    <>
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

          {/* Vista previa */}
          {imagenPreview && (
            <div className="flex justify-center mb-4">
              <img
                src={imagenPreview}
                alt="Vista previa de la imagen"
                className="max-w-[300px] max-h-[300px] w-full h-auto rounded-md"
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={anteriorPaso}
              className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-500"
            >
              Volver
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              className="cursor-pointer bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Finalizar
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default FotoEvento;
