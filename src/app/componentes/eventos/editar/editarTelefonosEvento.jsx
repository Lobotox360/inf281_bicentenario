'use client';
import React, { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EditarTelefonosEvento = ({ siguientePaso, anteriorPaso, eventoId }) => {
  const [telefonosAgregados, setTelefonosAgregados] = useState([]);  // Inicializa como arreglo vacío si no hay datos
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [nuevoTelefono, setNuevoTelefono] = useState({
    telefono: ''  // Asegúrate de usar 'telefono' para coincidir con el objeto
  });

  const router = useRouter();
  useEffect(() => {
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`);
        const data = await response.json();
        console.log(data.Telefonos);
        if (data && data.Telefonos) {
          setTelefonosAgregados(data.Telefonos); // 👈 Carga los teléfonos actuales
        }
      } catch (error) {
        console.error("❌ Error al cargar los teléfonos:", error);
      }
    };

    if (eventoId) {
      fetchEventoData();
    }
  }, [eventoId]);


  // Función para agregar teléfono
  const handleAgregarTelefono = () => {
    if (!nuevoTelefono.telefono) return; // Validar que el número de teléfono no esté vacío
  
    // Evitar agregar teléfonos repetidos
    if (!telefonosAgregados.some(telofono => telofono.telefono === nuevoTelefono.telefono)) {
      const nuevosTelefonos = [...telefonosAgregados, nuevoTelefono];
      setTelefonosAgregados(nuevosTelefonos);
      
      // Llamar a handleUpdateData después de actualizar el estado
      setNuevoTelefono({ telefono: '' }); // Limpiar el campo
    }
  };

  // Función para quitar un teléfono
  const handleQuitarTelefono = (index) => {
    const nuevosTelefonos = telefonosAgregados.filter((_, i) => i !== index);
    setTelefonosAgregados(nuevosTelefonos);
  };

  // Manejo de cambios en el campo de teléfono
  const handleNuevoTelefonoChange = (e) => {
    const { name, value } = e.target;
    setNuevoTelefono({ ...nuevoTelefono, [name]: value });
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
      <h3 className="text-2xl font-semibold text-center py-4">Paso 4: Agregar telefonos de contacto</h3>
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
            <div className='flex justify-center'>
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
              <li key={telefono.id_telefono} className="flex justify-between items-center mb-2">
                <span>{telefono.numero}</span> {/* Usamos 'telefono' ya que así se definió el campo */}
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

export default EditarTelefonosEvento;
