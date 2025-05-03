'use client';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpositoresEvento = ({ siguientePaso, anteriorPaso, handleUpdateData, eventoData }) => {
  const [expositoresAgregados, setExpositoresAgregados] = useState(eventoData.expositores || []);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [nuevoExpositor, setNuevoExpositor] = useState({
    nombre: '',
    especialidad: '',
    institucion: '',
    contacto: ''
  });

  const handleNuevoExpositorChange = (e) => {
    const { name, value } = e.target;
    setNuevoExpositor({ ...nuevoExpositor, [name]: value });
  };

  const handleSiguientePaso = () => {
    if (expositoresAgregados.length === 0) {
      toast.error('Debes agregar al menos un expositor para continuar');
      return;
    }
    siguientePaso();
  };

  const handleAgregarExpositor = () => {
    const { nombre, especialidad } = nuevoExpositor;
    if (!nombre || !especialidad) {
      toast.warning('Nombre y especialidad son obligatorios');
      return;
    }

    const yaExiste = expositoresAgregados.some(
      expositor => expositor.nombre === nombre && expositor.especialidad === especialidad
    );

    if (yaExiste) {
      toast.warning('Este expositor ya ha sido agregado');
      return;
    }

    const nuevosExpositores = [...expositoresAgregados, nuevoExpositor];
    setExpositoresAgregados(nuevosExpositores);
    handleUpdateData('expositores', nuevosExpositores);
    setNuevoExpositor({ nombre: '', especialidad: '', institucion: '', contacto: '' });
    toast.success('Expositor agregado');
  };

  const handleQuitarExpositor = (index) => {
    const nuevosExpositores = expositoresAgregados.filter((_, i) => i !== index);
    setExpositoresAgregados(nuevosExpositores);
    handleUpdateData('expositores', nuevosExpositores);
    toast.info('Expositor eliminado');
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <form className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center py-4">Paso 3: Agregar expositores</h3>

          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={() => setMostrarAgregar(true)}
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
            >
              Crear Nuevo Expositor
            </button>
          </div>

          {mostrarAgregar && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Nuevo Expositor</h3>
              <input
                type="text"
                name="nombre"
                value={nuevoExpositor.nombre}
                onChange={handleNuevoExpositorChange}
                placeholder="Nombre"
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <input
                type="text"
                name="especialidad"
                value={nuevoExpositor.especialidad}
                onChange={handleNuevoExpositorChange}
                placeholder="Especialidad"
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <input
                type="text"
                name="institucion"
                value={nuevoExpositor.institucion}
                onChange={handleNuevoExpositorChange}
                placeholder="Institución"
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <input
                type="text"
                name="contacto"
                value={nuevoExpositor.contacto}
                onChange={handleNuevoExpositorChange}
                placeholder="Contacto"
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <div className='flex justify-center'>
                <button
                  type="button"
                  onClick={handleAgregarExpositor}
                  className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-green-400"
                >
                  Guardar Nuevo Expositor
                </button>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Expositores Añadidos</h3>
            <ul>
              {expositoresAgregados.map((expositor, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{expositor.nombre} - {expositor.especialidad} - {expositor.institucion} - {expositor.contacto}</span>
                  <button
                    type="button"
                    onClick={() => handleQuitarExpositor(index)}
                    className="cursor-pointer bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-400"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>

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
              onClick={handleSiguientePaso}
              className="cursor-pointer bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={4000} pauseOnHover />
    </>
  );
};

export default ExpositoresEvento;
