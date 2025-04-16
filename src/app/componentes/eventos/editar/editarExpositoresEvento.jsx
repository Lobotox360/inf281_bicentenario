'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EditarExpositoresEvento = ({ siguientePaso, anteriorPaso, eventoId}) => {

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

    {/* VISUALIZAR DATOS ACTUALES*/}

  useEffect(() => {
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`);
        const data = await response.json();
        if (data) {
          // Actualizar la información general del evento
          setInformacion({
            nombre: data.nombre || '',
            especialidad: data.especialidad || '',
            institucion: data.institucion || '',
            contacto: data.contacto || '',
          });

          // Asignar todos los expositores actuales a 'expositoresAgregados'
          setExpositoresAgregados(data.Expositores || []); // Aquí asignamos todos los expositores
        } else {
          console.error('No se encontraron datos del evento');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    if (eventoId) {
      fetchEventoData(); // Llamada a la API si eventoId está disponible
    }
  }, [eventoId]);
  
  const handleAgregarExpositor = () => {
    if (!nuevoExpositor.nombre || !nuevoExpositor.especialidad) return; // Validar que el nombre y especialidad estén completos
    // Evitar agregar expositores repetidos
    if (!expositoresAgregados.some(expositor => expositor.nombre === nuevoExpositor.nombre && expositor.especialidad === nuevoExpositor.especialidad)) {
      setNuevoExpositor({ nombre: '', especialidad: '', institucion: '', contacto: '' }); // Limpiar campos
      const nuevosExpositores = [...expositoresAgregados, nuevoExpositor];
      setExpositoresAgregados(nuevosExpositores);
    }
  };
    
  // Enviar nuevo patrocinador al backend y actualizar la lista en tiempo real
  const handleAgregarNuevoExpositor = async () => {
    try {
      const res = await fetch('https://inf281-production.up.railway.app/eventos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoExpositor),
      });

      if (!res.ok) throw new Error('Error al agregar el patrocinador');

      const nuevoPatrocinadorRespuesta = await res.json();
      setNuevoExpositor({
        nombre: '',
        especialidad: '',
        institucion: '',
        contacto: ''
      });

      alert('✅ Patrocinador agregado exitosamente!');
      setMostrarAgregar(false);
    } catch (error) {
      console.error('Error al agregar patrocinador:', error);
      alert('❌ Ocurrió un error al agregar el patrocinador.');
    }
  };

  const handleQuitarExpositor = (index) => {
    const nuevosExpositores = expositoresAgregados.filter((_, i) => i !== index);
    setExpositoresAgregados(nuevosExpositores);
  };

  // Manejo de cambios en el formulario de nuevo patrocinador
  const handleNuevoExpositorChange = (e) => {
    const { name, value } = e.target;
    setNuevoExpositor({ ...nuevoExpositor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(informacion),
      });

      if (response.ok) {
        alert('✅ Evento actualizado exitosamente');
        siguientePaso();  // Avanzar al siguiente paso si la actualización es exitosa
      } else {
        alert('❌ Error al actualizar el evento');
      }
    } catch (error) {
      console.error('❌ Error del data:', error);
      alert('❌ Error al actualizar el evento');
    }
  };

  const handleBack = () => {
    router.back(); // Regresa a la página anterior en el historial
  };


  return (
    <div className="max-w-4xl mx-auto">
      <form className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 3: Agregar expositores</h3>

        {/* Formulario para agregar nuevo patrocinador */}
        <div className="mb-4 flex justify-center">
            <button
                type="button"
                onClick={() => setMostrarAgregar(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
            >
                Crear Nuevo Expositor
            </button>
        </div>
        {/* Mostrar formulario de nuevo patrocinador */}
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

        {/* Mostrar patrocinadores añadidos */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Expositores Añadidos</h3>
          <ul>
            {expositoresAgregados.map((expositor, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                    <span>{expositor.nombre} - {expositor.especialidad}</span> {/* Usamos nombre y especialidad */}
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
            onClick={handleBack}
            className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-400"
          >
            Salir sin guardar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Guardar cambios y salir
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditarExpositoresEvento;
