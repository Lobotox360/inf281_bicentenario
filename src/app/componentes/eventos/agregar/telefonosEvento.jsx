'use client';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TelefonosEvento = ({ siguientePaso, anteriorPaso, handleUpdateData, eventoData }) => {
  const [telefonosAgregados, setTelefonosAgregados] = useState(eventoData.telefonos || []);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [nuevoTelefono, setNuevoTelefono] = useState({ telefono: '' });

  // Validar y agregar nuevo teléfono
  const handleAgregarTelefono = () => {
    const telefonoValido = nuevoTelefono.telefono.trim();

    if (!telefonoValido) {
      toast.warning('El número de teléfono no puede estar vacío');
      return;
    }

    if (!/^\d{6,15}$/.test(telefonoValido)) {
      toast.error('El teléfono debe tener entre 6 y 15 dígitos');
      return;
    }

    if (telefonosAgregados.some(t => t.telefono === telefonoValido)) {
      toast.info('Ese teléfono ya fue agregado');
      return;
    }

    const nuevosTelefonos = [...telefonosAgregados, { telefono: telefonoValido }];
    setTelefonosAgregados(nuevosTelefonos);
    handleUpdateData('telefonos', nuevosTelefonos);
    setNuevoTelefono({ telefono: '' });
    toast.success('Teléfono agregado');
  };

  // Quitar teléfono
  const handleQuitarTelefono = (index) => {
    const nuevosTelefonos = telefonosAgregados.filter((_, i) => i !== index);
    setTelefonosAgregados(nuevosTelefonos);
    handleUpdateData('telefonos', nuevosTelefonos);
  };

  const handleNuevoTelefonoChange = (e) => {
    const { name, value } = e.target;
    setNuevoTelefono({ ...nuevoTelefono, [name]: value });
  };

  const handleSiguientePaso = () => {
    if (telefonosAgregados.length === 0) {
      toast.error('Debes agregar al menos un teléfono para continuar');
      return;
    }
    siguientePaso();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <form className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center py-4">Paso 4: Agregar teléfonos de contacto</h3>

          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={() => setMostrarAgregar(true)}
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
            >
              Crear Nuevo Teléfono
            </button>
          </div>

          {mostrarAgregar && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Nuevo Teléfono</h3>
              <input
                type="tel"
                name="telefono"
                value={nuevoTelefono.telefono}
                onChange={handleNuevoTelefonoChange}
                placeholder="Teléfono"
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleAgregarTelefono}
                  className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-green-400"
                >
                  Guardar Teléfono
                </button>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Teléfonos Añadidos</h3>
            <ul>
              {telefonosAgregados.map((telefono, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{telefono.telefono}</span>
                  <button
                    type="button"
                    onClick={() => handleQuitarTelefono(index)}
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
      <ToastContainer />
    </>
  );
};

export default TelefonosEvento;
