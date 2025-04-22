'use client';
import React, { useState } from 'react';

const ExpositoresEvento = ({ siguientePaso, anteriorPaso, handleUpdateData, eventoData }) => {
  const [expositoresAgregados, setExpositoresAgregados] = useState(eventoData.expositores || []);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [nuevoExpositor, setNuevoExpositor] = useState({
    nombre: '',
    especialidad: '',
    institucion: '',
    contacto: ''
  });
  const [error, setError] = useState(''); // Estado para manejar los mensajes de error

  // Manejo de cambios en el formulario de nuevo expositor
  const handleNuevoExpositorChange = (e) => {
    const { name, value } = e.target;
    setNuevoExpositor({ ...nuevoExpositor, [name]: value });
  };

  // Validar si hay al menos un expositor agregado antes de avanzar
  const handleSiguientePaso = () => {
    if (expositoresAgregados.length === 0) {
      setError('Debes agregar al menos un expositor para continuar');
      return; // No permite avanzar si no hay expositores
    }

    setError(''); // Limpiar mensaje de error
    siguientePaso(); // Si todo está bien, avanzar al siguiente paso
  };

  const handleAgregarExpositor = () => {
    if (!nuevoExpositor.nombre || !nuevoExpositor.especialidad) return; // Validar que el nombre y especialidad estén completos
  
    // Evitar agregar expositores repetidos
    if (!expositoresAgregados.some(expositor => expositor.nombre === nuevoExpositor.nombre && expositor.especialidad === nuevoExpositor.especialidad)) {
      setNuevoExpositor({ nombre: '', especialidad: '', institucion: '', contacto: '' }); // Limpiar campos
      const nuevosExpositores = [...expositoresAgregados, nuevoExpositor];
      setExpositoresAgregados(nuevosExpositores);
      handleUpdateData('expositores', nuevosExpositores);
    }
  };

  const handleQuitarExpositor = (index) => {
    const nuevosExpositores = expositoresAgregados.filter((_, i) => i !== index);
    setExpositoresAgregados(nuevosExpositores);
    handleUpdateData('expositores', nuevosExpositores);
  };

  // Enviar nuevo expositor al backend y actualizar la lista en tiempo real
  const handleAgregarNuevoExpositor = async () => {
    try {
      const res = await fetch('https://inf281-production.up.railway.app/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoExpositor),
      });

      if (!res.ok) throw new Error('Error al agregar el expositor');

      const nuevoExpositorRespuesta = await res.json();
      setNuevoExpositor({
        nombre: '',
        especialidad: '',
        institucion: '',
        contacto: ''
      });

      alert('✅ Expositor agregado exitosamente!');
      setMostrarAgregar(false);
    } catch (error) {
      console.error('Error al agregar expositor:', error);
      alert('❌ Ocurrió un error al agregar el expositor.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 3: Agregar expositores</h3>

        {error && <p className="text-red-500 text-center">{error}</p>} {/* Mostrar mensaje de error */}

        {/* Formulario para agregar nuevo expositor */}
        <div className="mb-4 flex justify-center">
            <button
                type="button"
                onClick={() => setMostrarAgregar(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
            >
                Crear Nuevo Expositor
            </button>
        </div>

        {/* Mostrar formulario de nuevo expositor */}
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
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-green-400"
                >
                Guardar Nuevo Expositor
                </button>
            </div>
          </div>
        )}

        {/* Mostrar expositores añadidos */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Expositores Añadidos</h3>
          <ul>
            {expositoresAgregados.map((expositor, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                    <span>{expositor.nombre} - {expositor.especialidad}</span>
                    <button
                    type="button"
                    onClick={() => handleQuitarExpositor(index)}
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

export default ExpositoresEvento;
