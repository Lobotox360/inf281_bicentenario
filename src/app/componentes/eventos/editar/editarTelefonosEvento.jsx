'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';  // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

const EditarTelefonosEvento = ({ eventoId }) => {
  const [telefonosAgregados, setTelefonosAgregados] = useState([]);
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [nuevoTelefono, setNuevoTelefono] = useState({
    telefono: ''
  });

  const router = useRouter();
  useEffect(() => {
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/telefono/${eventoId}`);
        const data = await response.json();
        if (data) {
          setTelefonosAgregados(data); 
        }
      } catch (error) {
        console.error("❌ Error al cargar los teléfonos:", error);
        toast.error('❌ Error al cargar los teléfonos');
      }
    };

    if (eventoId) {
      fetchEventoData();
    }
  }, [eventoId]);

  const handleAgregarTelefono = () => {
    if (!nuevoTelefono.telefono) return;
    if (!telefonosAgregados.some(telofono => telofono.numero === nuevoTelefono.telefono)) {
      const nuevosTelefonos = [...telefonosAgregados, nuevoTelefono];
      setTelefonosAgregados(nuevosTelefonos);
      setNuevoTelefono({ telefono: '' });
      toast.success('Teléfono añadido exitosamente');
    } else {
      toast.error('El teléfono ya está en la lista');
    }
  };

  const handleQuitarTelefono = (index) => {
    const nuevosTelefonos = telefonosAgregados.filter((_, i) => i !== index);
    setTelefonosAgregados(nuevosTelefonos);
    toast.warning('Teléfono eliminado');
  };

  const handleNuevoTelefonoChange = (e) => {
    const { name, value } = e.target;
    setNuevoTelefono({ ...nuevoTelefono, [name]: value });
  };

  const telefonosFormateados = telefonosAgregados.map(telefono => ({
    telefono: telefono.numero || telefono.telefono
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://inf281-production.up.railway.app/telefono/${eventoId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(telefonosFormateados),
      });

      if (response.ok) {
        toast.success('Evento actualizado exitosamente');
      } else {
        toast.error('Error al actualizar el evento');
      }
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      toast.error('Error al actualizar el evento');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 4: Agregar telefonos de contacto</h3>
        
        {/* Formulario para agregar nuevo teléfono */}
        <div className="mb-4 flex justify-center">
          <button
            type="button"
            onClick={() => setMostrarAgregar(true)}
            className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
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
            <div className='flex justify-center'>
              <button
                type="button"
                onClick={handleAgregarTelefono}
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
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
                <span>{telefono.numero || telefono.telefono}</span>
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

        {/* Botones de navegación */}
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

export default EditarTelefonosEvento;
