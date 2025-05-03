'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InformacionEvento = ({ siguientePaso, handleUpdateData, eventoData }) => {
  const [informacion, setInformacion] = useState(eventoData.informacion || {}); 
  const router = useRouter();

  useEffect(() => {
    setInformacion(eventoData.informacion || {});
  }, [eventoData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInformacion(prev => ({ ...prev, [name]: value }));
  };

  const validarCampos = () => {
    if (!informacion.titulo || !informacion.descripcion || !informacion.modalidad || !informacion.costo || !informacion.horaInicio || !informacion.horaFin) {
      toast.error('Debes llenar todos los campos antes de continuar');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validarCampos()) {
      handleUpdateData('informacion', informacion);
      siguientePaso();
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center py-4">Paso 1: Información general del Evento</h3>

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
                className="cursor-pointer w-full p-2 border border-gray-300 rounded-md"
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

          <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4">
            <div className="w-full">
              <label htmlFor="hora_inicio" className="block text-sm font-medium text-gray-700">Hora inicio</label>
              <input
                type="datetime-local"
                id="hora_inicio"
                name="horaInicio"
                value={informacion.horaInicio || ''}
                onChange={handleInputChange}
                className="cursor-pointer w-full p-2 border border-gray-300 rounded-md"
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
                className="cursor-pointer w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-400"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </>
  );
};

export default InformacionEvento;
