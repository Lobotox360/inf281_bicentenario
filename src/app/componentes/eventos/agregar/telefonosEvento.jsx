'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const TelefonosEvento = ({ siguientePaso, anteriorPaso, handleUpdateData, eventoData }) => {
  const [telefonosAgregados, setTelefonosAgregados] = useState(eventoData.telefonos || []);  // Inicializa como arreglo vacío si no hay datos
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [nuevoTelefono, setNuevoTelefono] = useState({
    telefono: ''  // Asegúrate de usar 'telefono' para coincidir con el objeto
  });
  const [error, setError] = useState(''); // Estado para el mensaje de error

  const router = useRouter();

  // Función para agregar teléfono
  const handleAgregarTelefono = () => {
    if (!nuevoTelefono.telefono) return; // Validar que el número de teléfono no esté vacío
  
    // Evitar agregar teléfonos repetidos
    if (!telefonosAgregados.some(telofono => telofono.telefono === nuevoTelefono.telefono)) {
      const nuevosTelefonos = [...telefonosAgregados, nuevoTelefono];
      setTelefonosAgregados(nuevosTelefonos);
      
      // Llamar a handleUpdateData después de actualizar el estado
      handleUpdateData('telefonos', nuevosTelefonos);
      setNuevoTelefono({ telefono: '' }); // Limpiar el campo
    }
  };

  // Función para quitar un teléfono
  const handleQuitarTelefono = (index) => {
    const nuevosTelefonos = telefonosAgregados.filter((_, i) => i !== index);
    setTelefonosAgregados(nuevosTelefonos);
    handleUpdateData('telefonos', nuevosTelefonos);
  };

  // Manejo de cambios en el campo de teléfono
  const handleNuevoTelefonoChange = (e) => {
    const { name, value } = e.target;
    setNuevoTelefono({ ...nuevoTelefono, [name]: value });
  };

  // Validar que haya al menos un teléfono antes de avanzar al siguiente paso
  const handleSiguientePaso = () => {
    if (telefonosAgregados.length === 0) {
      setError('Debes agregar al menos un teléfono para continuar');
      return; // No permite avanzar si no hay teléfonos
    }

    setError(''); // Limpiar mensaje de error si todo está bien
    siguientePaso(); // Avanzar al siguiente paso
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 4: Agregar teléfonos de contacto</h3>

        {error && <p className="text-red-500 text-center">{error}</p>} {/* Mostrar mensaje de error */}

        {/* Formulario para agregar nuevo teléfono */}
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            onClick={() => setMostrarAgregar(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
          >
            Crear Nuevo Teléfono
          </button>
        </div>

        {/* Mostrar formulario de nuevo teléfono */}
        {mostrarAgregar && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Nuevo Teléfono</h3>
            <input
              type="text"
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
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
              >
                Guardar Teléfono
              </button>
            </div>
          </div>
        )}

        {/* Mostrar teléfonos añadidos */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Teléfonos Añadidos</h3>
          <ul>
            {telefonosAgregados.map((telefono, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{telefono.telefono}</span> {/* Usamos 'telefono' ya que así se definió el campo */}
                <button
                  type="button"
                  onClick={() => handleQuitarTelefono(index)}
                  className="bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-400"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={anteriorPaso}
            className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-500"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={handleSiguientePaso} // Validar antes de avanzar
            className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default TelefonosEvento;
