'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatrocinadoresEvento = ({ siguientePaso, anteriorPaso, handleUpdateData, eventoData }) => {
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [selectedPatrocinador, setSelectedPatrocinador] = useState();
  const [addedPatrocinadores, setAddedPatrocinadores] = useState(eventoData.patrocinadores || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nuevoPatrocinador, setNuevoPatrocinador] = useState({
    razon_social: '',
    institucion: '',
  });

  const router = useRouter();

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
      toast.error('Error al obtener patrocinadores');
      console.error("Error al obtener patrocinadores:", error);
    }
  };

  useEffect(() => {
    fetchPatrocinadores();
  }, []);

  const handleAgregarPatrocinador = () => {
    if (!selectedPatrocinador) {
      toast.warning('Selecciona un patrocinador para agregar');
      return;
    }

    const yaExiste = addedPatrocinadores.some(p => p.value === selectedPatrocinador.value);
    if (yaExiste) {
      toast.info('Este patrocinador ya fue añadido');
      return;
    }

    const nuevos = [...addedPatrocinadores, selectedPatrocinador];
    setAddedPatrocinadores(nuevos);
    handleUpdateData('patrocinadores', nuevos);
    setSelectedPatrocinador('');
    toast.success('Patrocinador agregado');
  };

  const handleQuitarPatrocinador = (index) => {
    const nuevos = addedPatrocinadores.filter((_, i) => i !== index);
    setAddedPatrocinadores(nuevos);
    handleUpdateData('patrocinadores', nuevos);
    toast.info('🗑️ Patrocinador eliminado');
  };

  const handleNuevoPatrocinadorChange = (e) => {
    const { name, value } = e.target;
    setNuevoPatrocinador({ ...nuevoPatrocinador, [name]: value });
  };

  const handleAgregarNuevoPatrocinador = async () => {
    try {
      const res = await fetch('https://inf281-production.up.railway.app/evento/patrocinador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPatrocinador),
      });

      if (!res.ok) throw new Error('Error al agregar el patrocinador');

      await res.json();
      setNuevoPatrocinador({ razon_social: '', institucion: '' });
      fetchPatrocinadores();
      setShowAddForm(false);
      toast.success('Patrocinador agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar patrocinador:', error);
      toast.error('Ocurrió un error al agregar el patrocinador');
    }
  };

  const handleSiguientePaso = () => {
    if (addedPatrocinadores.length === 0) {
      toast.error('Debes agregar al menos un patrocinador');
      return;
    }
    siguientePaso();
  };

  return (
    <>
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
              value={selectedPatrocinador}
              onChange={setSelectedPatrocinador}
              placeholder="Busca o selecciona un patrocinador"
              isSearchable
            />
          </div>

          {/* Botones para agregar patrocinador o mostrar formulario */}
          <div className="flex flex-col sm:flex-row justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-8">
            <button
              type="button"
              onClick={handleAgregarPatrocinador}
              className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Añadir Patrocinador
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
            >
              Crear Nuevo Patrocinador
            </button>
          </div>

          {/* Formulario para nuevo patrocinador */}
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
                  className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-300"
                >
                  Guardar Nuevo Patrocinador
                </button>
              </div>
            </div>
          )}

          {/* Lista de patrocinadores añadidos */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Patrocinadores Añadidos</h3>
            <ul>
              {addedPatrocinadores.map((patrocinador, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                  <span>{patrocinador.razon_social} - {patrocinador.institucion}</span>
                  <button
                    type="button"
                    onClick={() => handleQuitarPatrocinador(index)}
                    className="cursor-pointer bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-400"
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
      <ToastContainer/>
    </>
  );
};

export default PatrocinadoresEvento;
