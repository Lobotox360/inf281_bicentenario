'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const EditarInformacionEvento = ({eventoId}) => {
  const [informacion, setInformacion] = useState({
    titulo: '',
    descripcion: '',
    modalidad: '',
    costo: 0.0,
    hora_inicio: '',
    hora_fin: '',
  });
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("access_token"));
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`);
        const data = await response.json();
        if (data) {
          setInformacion({
            titulo: data.titulo || '',
            descripcion: data.descripcion || '',
            modalidad: data.modalidad || '',
            costo: data.costo || 0.0,
            hora_inicio: data.hora_inicio || '',
            hora_fin: data.hora_fin || '',
          });
        } else {
          console.error('No se encontraron datos del evento');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error('Error al cargar los datos del evento');  
      }
    };
    if (eventoId) {
      fetchEventoData();
    }
  }, [eventoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInformacion({
      ...informacion,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const costo = parseFloat(informacion.costo);
    const titulo = informacion.titulo;
    const descripcion = informacion.descripcion;
    const modalidad = informacion.modalidad;
    const hora_inicio = informacion.hora_inicio;
    const hora_fin = informacion.hora_fin;
    const bodyData = {
      titulo,
      descripcion,
      modalidad,
      costo,
      hora_inicio,
      hora_fin
    };
  
    try {
      if (!token) {throw new Error("Acceso denegado");}
      const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyData), 
      });
  
      if (response.ok) {
        toast.success('Evento actualizado exitosamente');  // Show success toast
      } else {
        toast.error('Error al actualizar el evento');  // Show error toast
      }
    } catch (error) {
      console.error('❌ Error del data:', error);
      toast.error('Error al actualizar el evento');  // Show error toast
    }
  };

  const handleBack = () => {
    router.back(); 
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título del Evento</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={informacion.titulo}
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
            value={informacion.descripcion}
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
              value={informacion.modalidad}
              onChange={handleInputChange}
              className="cursor-pointer w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Selecciona una modalidad</option>
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
              value={parseFloat(informacion.costo)}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4">
          <div className="w-full">
            <label htmlFor="hora_inicio" className="block text-sm font-medium text-gray-700">Hora inicio</label>
            <input
              type="datetime-local"
              id="hora_inicio"
              name="hora_inicio"
              value={informacion.hora_inicio}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="w-full mt-4 sm:mt-0">
            <label htmlFor="hora_fin" className="block text-sm font-medium text-gray-700">Hora fin</label>
            <input
              type="datetime-local"
              id="hora_fin"
              name="hora_fin"
              value={informacion.hora_fin}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Botón para guardar los cambios */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-400"
          >
            Salir sin guardar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Guardar cambios y salir
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditarInformacionEvento;
