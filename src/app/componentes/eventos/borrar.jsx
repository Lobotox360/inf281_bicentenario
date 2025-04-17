'use client';
import React, { useState } from 'react';

const EditarEvento = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Obtenemos el primer archivo seleccionado
    if (file) {
      setImage(file);  // Almacenamos el archivo en el estado
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      location,
      image,
    };

    
   {/* // Realizar una solicitud POST para agregar el nuevo evento
    axios.post('/api/events', eventData).then(() => {
      router.push('/eventos'); // Redirige a la lista de eventos después de agregar
    });*/}
  };

  return (
    <div className="p-4 px-100 mt-24">
      <h2 className="text-white text-2xl font-semibold text-center"> Editar Evento</h2>
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Evento</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicación</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen del Evento</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Actualizar Evento
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarEvento;
