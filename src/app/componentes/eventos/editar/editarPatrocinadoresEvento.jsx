'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const EditarPatrocinadoresEvento = ({ siguientePaso, anteriorPaso, eventoId}) => {
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [selectedPatrocinador, setSelectedPatrocinador] = useState();
  const [addedPatrocinadores, setAddedPatrocinadores] = useState([]);
  const [informacion, setInformacion] = useState({
      razon_social: '',
      institucion: ''
    });
  const [showAddForm, setShowAddForm] = useState(false);
  const [nuevoPatrocinador, setNuevoPatrocinador] = useState({
    razon_social: '',
    institucion: '',
  });

  const router = useRouter();

    {/* VISUALIZAR DATOS ACTUALES*/}

  useEffect(() => {
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`);
        const data = await response.json();
        console.log(data);

        if (data) {
          setInformacion({
            razon_social: data.razon_social || '',
            institucion: data.institucion || '',
          });

          // Asignar todos los expositores actuales a 'expositoresAgregados'
          const patrocinadoresExtraidos = (data.Eventos_Patrocinadores || []).map(item => item.Patrocinadores);
          setAddedPatrocinadores(patrocinadoresExtraidos || []); // Aquí asignamos todos los expositores
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
  

  // Cargar patrocinadores desde la API
  const fetchPatrocinadores = async () => {
    try {
      const respuesta = await fetch('https://inf281-production.up.railway.app/evento/patrocinador');
      const datos = await respuesta.json();
      setPatrocinadores(datos.map(p => ({
        value: p.id_patrocinador,
        label: `${p.razon_social} - ${p.institucion}`,
        ...p
      })));
    } catch (error) {
      console.error("Error al obtener patrocinadores:", error);
    }
  };

  useEffect(() => {
    fetchPatrocinadores(); // Se llama una vez cuando el componente se monta
  }, []);

  

  const handleAgregarPatrocinador = () => {
    if (!selectedPatrocinador) return;

    const patrocinadorSeleccionado = patrocinadores.find(
      (patrocinador) => patrocinador.id_patrocinador === selectedPatrocinador.value
    );

    if (patrocinadorSeleccionado && !addedPatrocinadores.some(p => p.value === patrocinadorSeleccionado.value)) {
      const nuevosPatrocinadores = [...addedPatrocinadores, patrocinadorSeleccionado];
      setAddedPatrocinadores(nuevosPatrocinadores);
      
      setSelectedPatrocinador(''); // Limpiar la selección
    }
    
  };

  const handleQuitarPatrocinador = (index) => {
    const nuevosPatrocinadores = addedPatrocinadores.filter((_, i) => i !== index);

    // Actualizar el estado de los patrocinadores añadidos
    setAddedPatrocinadores(nuevosPatrocinadores);
  };

  // Manejo de cambios en el formulario de nuevo patrocinador
  const handleNuevoPatrocinadorChange = (e) => {
    const { name, value } = e.target;
    setNuevoPatrocinador({ ...nuevoPatrocinador, [name]: value });
  };

  // Enviar nuevo patrocinador al backend y actualizar la lista en tiempo real
  const handleAgregarNuevoPatrocinador = async () => {
    try {
      const res = await fetch('https://inf281-production.up.railway.app/evento/patrocinador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPatrocinador),
      });

      if (!res.ok) throw new Error('Error al agregar el patrocinador');

      const nuevoPatrocinadorRespuesta = await res.json();
      setNuevoPatrocinador({
        razon_social: '',
        institucion: '',
      });

      // Recargar la lista de patrocinadores para reflejar el nuevo
      fetchPatrocinadores();

      alert('✅ Patrocinador agregado exitosamente!');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error al agregar patrocinador:', error);
      alert('❌ Ocurrió un error al agregar el patrocinador.');
    }
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
        <h3 className="text-2xl font-semibold text-center py-4">Paso 2: Seleccionar patrocinadores</h3>
        {/* Select de patrocinadores existentes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona un Patrocinador
          </label>
          <Select
            options={patrocinadores}
            value={selectedPatrocinador}  // Asigna el objeto completo
            onChange={setSelectedPatrocinador}  // Simplemente establece el objeto completo
            placeholder="Busca o selecciona un patrocinador"
            isSearchable
            />
        </div>
        <div className="flex justify-center mt-4 space-x-8">
            {/* Botón para agregar patrocinador de la lista */}
            <div className="mb-4">
            <button
                type="button"
                onClick={handleAgregarPatrocinador}
                className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
                Añadir Patrocinador
            </button>
            </div>

            {/* Formulario para agregar nuevo patrocinador */}
            <div className="mb-4">
            <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
            >
                Crear Nuevo Patrocinador
            </button>
            </div>
        </div>
        {/* Mostrar formulario de nuevo patrocinador */}
        {showAddForm && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Nuevo Patrocinador</h3>
            <input
              type="text"
              name="razon_social"
              value={nuevoPatrocinador.razon_social}
              onChange={handleNuevoPatrocinadorChange}
              placeholder="Razón social"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              name="institucion"
              value={nuevoPatrocinador.institucion}
              onChange={handleNuevoPatrocinadorChange}
              placeholder="Institución"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <div className='flex justify-center'>
                <button
                type="button"
                onClick={handleAgregarNuevoPatrocinador}
                className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-300"
                >
                Guardar Nuevo Patrocinador
                </button>
            </div>
          </div>
        )}

        {/* Mostrar patrocinadores añadidos */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Patrocinadores Añadidos</h3>
          <ul>
            {addedPatrocinadores.map((patrocinador, index) => (
              <li key={patrocinador.id_patrocinador} className="flex justify-between items-center mb-2">
                <span>{patrocinador.razon_social}</span>
                <span>{patrocinador.institucion}</span>
                <button
                  type="button"
                  onClick={() => handleQuitarPatrocinador(index)}
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

export default EditarPatrocinadoresEvento;
