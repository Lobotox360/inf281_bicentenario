'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const InformacionEvento = ({ siguientePaso, handleUpdateData, eventoData }) => {
  const [informacion, setInformacion] = useState(eventoData.informacion || {}); // Inicializa con los datos previos
  const [error, setError] = useState(''); // Estado para el mensaje de error

  useEffect(() => {
    // Si los datos de `eventoData` cambian, actualizar `informacion`
    setInformacion(eventoData.informacion || {});
  }, [eventoData]);

  // Manejo de los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInformacion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validar los campos antes de avanzar al siguiente paso
  const validarCampos = () => {
    if (!informacion.titulo || !informacion.descripcion || !informacion.modalidad || !informacion.costo || !informacion.horaInicio || !informacion.horaFin) {
      setError('Debes llenar todos los campos');
      return false; 
    }

    setError(''); // Limpiar el mensaje de error si todo está correcto
    return true; // Si todo está completo, avanzamos
  };

  // Enviar los datos a la función `handleUpdateData`
  const handleSubmit = () => {
    if (validarCampos()) {
      handleUpdateData('informacion', informacion); // Actualiza los datos en el estado global
      siguientePaso(); // Avanza al siguiente paso
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 1: Información general del Evento</h3>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título del Evento</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={informacion.titulo || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={informacion.descripcion || ''}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="w-full">
            <label htmlFor="modalidad" className="block text-sm font-medium text-gray-700">Modalidad</label>
            <select
              name="modalidad"
              id="modalidad"
              value={informacion.modalidad || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>Seleccione una modalidad</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="hibrida">Híbrida</option>
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="costo" className="block text-sm font-medium text-gray-700">Costo</label>
            <input 
              type="number" 
              name="costo"
              id="costo"
              value={informacion.costo || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="w-full">
            <label htmlFor="hora_inicio" className="block text-sm font-medium text-gray-700">Hora inicio</label>
            <input
              type="datetime-local"
              id="hora_inicio"
              name="horaInicio"
              value={informacion.horaInicio || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="w-full">
            <label htmlFor="hora_fin" className="block text-sm font-medium text-gray-700">Hora fin</label>
            <input
              type="datetime-local"
              id="hora_fin"
              name="horaFin"
              value={informacion.horaFin || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Botón para avanzar al siguiente paso */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}  // Enviar los datos y avanzar
            className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default InformacionEvento;
