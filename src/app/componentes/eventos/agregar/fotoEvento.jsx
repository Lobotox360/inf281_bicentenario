'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FotoEvento = ({anteriorPaso, handleUpdateData, eventoData }) => {
  const [imagen, setImagen] = useState(eventoData.foto || null);  // Mantener la imagen desde los datos previos
  const [imagenPreview, setImagenPreview] = useState(eventoData.foto ? eventoData.foto : null); // Para la vista previa
  const [error, setError] = useState(''); // Estado para manejar los errores
  const router = useRouter();

  // Manejo de cambios para la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file)); // Vista previa de la imagen
      handleUpdateData('foto', file);  // Actualizar el estado global con la imagen seleccionada
    }
  };

  // Manejo del envío de los datos finales
  const handleFinalSubmit = async () => {
    if (!imagen) {
      setError("Por favor, selecciona una imagen.");
      return;
    }
    setError('')
    const formData = new FormData();
    formData.append("foto_evento", imagen); // Adjuntamos la imagen al FormData

    // Asegúrate de incluir todos los otros datos del evento en el FormData
    formData.append("titulo", eventoData.informacion.titulo);
    formData.append("descripcion", eventoData.informacion.descripcion);
    formData.append("hora_inicio", eventoData.informacion.horaInicio);
    formData.append("hora_fin", eventoData.informacion.horaFin);
    formData.append("costo", eventoData.informacion.costo);
    formData.append("modalidad", eventoData.informacion.modalidad);
    formData.append("patrocinador", JSON.stringify(eventoData.patrocinadores.map(patrocinador => ({
        id_auspiciador: patrocinador.id_patrocinador}))
    ));
    formData.append("expositor", JSON.stringify(eventoData.expositores));
    formData.append("categoria", JSON.stringify(eventoData.categorias.map(categoria => ({
      id_categoria: categoria.id_categoria}))
    ));
    formData.append("telefonos_contacto", JSON.stringify(eventoData.telefonos));
    formData.append("ubicacion", JSON.stringify(eventoData.ubicacion));

      // Verificar contenido
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }


    try {
      const res = await fetch('https://inf281-production.up.railway.app/eventos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al guardar el evento');

      const data = await res.json();
      alert("✅ Evento guardado con éxito!");
      // Redirigir o hacer algo después de enviar
      router.push('/eventos'); // Aquí puedes redirigir al evento guardado si lo deseas
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      alert('❌ Ocurrió un error al guardar el evento.');
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      <form className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 5: Agregar Imagen del Evento</h3>
        {error && <p className="text-red-500 text-center">{error}</p>} {/* Mostrar mensaje de error */}
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
            onClick={anteriorPaso}
            className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-500"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={handleFinalSubmit}  // Guarda la imagen y todos los datos
            className="cursor-pointer bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Finalizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FotoEvento;
