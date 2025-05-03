'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 

const EditarExpositoresEvento = ({ eventoId }) => {
  const [expositoresAgregados, setExpositoresAgregados] = useState([]);
  const [informacion, setInformacion] = useState({
    nombre: '',
    especialidad: '',
    institucion: '',
    contacto: ''
  });

  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [nuevoExpositor, setNuevoExpositor] = useState({
    nombre: '',
    especialidad: '',
    institucion: '',
    contacto: ''
  });

  const router = useRouter();

  // Visualizar datos actuales
  useEffect(() => {
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/expositor/${eventoId}`);
        const data = await response.json();

        if (data) {
          setInformacion({
            nombre: data.nombre || '',
            especialidad: data.especialidad || '',
            institucion: data.institucion || '',
            contacto: data.contacto || '',
          });

          setExpositoresAgregados(data || []); 
        } else {
          console.error('No se encontraron datos del evento');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    if (eventoId) {
      fetchEventoData(); 
    }
  }, [eventoId]);

  const handleAgregarExpositor = () => {
    if (!nuevoExpositor.nombre || !nuevoExpositor.especialidad) {
      toast.error('Nombre y especialidad son requeridos');  
      return;
    }
    
    // Evitar agregar expositores repetidos
    if (!expositoresAgregados.some(expositor => expositor.nombre === nuevoExpositor.nombre && expositor.especialidad === nuevoExpositor.especialidad)) {
      setNuevoExpositor({ nombre: '', especialidad: '', institucion: '', contacto: '' }); 
      const nuevosExpositores = [...expositoresAgregados, nuevoExpositor];
      setExpositoresAgregados(nuevosExpositores);
      toast.success('Expositor agregado correctamente');  
    } else {
      toast.error('Expositor ya agregado');
    }
  };

  const handleQuitarExpositor = (index) => {
    const nuevosExpositores = expositoresAgregados.filter((_, i) => i !== index);
    setExpositoresAgregados(nuevosExpositores);
    toast.warning('Expositor eliminado');  
  };

  const handleNuevoExpositorChange = (e) => {
    const { name, value } = e.target;
    setNuevoExpositor({ ...nuevoExpositor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expositoresFormateados = expositoresAgregados.map(expositor => ({
      nombre: expositor.nombre,
      especialidad: expositor.especialidad,
      institucion: expositor.institucion,
      contacto: expositor.contacto || ''
    }));

    const bodyData = { expositores: expositoresFormateados };

    try {
      const response = await fetch(`https://inf281-production.up.railway.app/expositor/${eventoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)  
      });

      if (response.ok) {
        toast.success('Expositores actualizados correctamente');
      } else {
        toast.error('Error al actualizar los expositores');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar los expositores');  
    }
  };

  const handleBack = () => {
    router.back(); 
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <form className="bg-white p-5 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          <h3 className="text-2xl font-semibold text-center py-4">Editar Expositores</h3>

          {/* Formulario para agregar nuevo expositor */}
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={() => setMostrarAgregar(true)}
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
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
              <div className="flex justify-center">
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

          {/* Mostrar expositores añadidos */}
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
              type="submit"
              className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Guardar cambios y salir
            </button>
          </div>

        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default EditarExpositoresEvento;
