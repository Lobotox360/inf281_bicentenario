'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

const EditarPatrocinadoresEvento = ({ eventoId }) => {
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [selectedPatrocinador, setSelectedPatrocinador] = useState(null);
  const [addedPatrocinadores, setAddedPatrocinadores] = useState([]);
  const [informacion, setInformacion] = useState({
    razon_social: '',
    institucion: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [nuevoPatrocinador, setNuevoPatrocinador] = useState({
    razon_social: '',
    institucion: '',
  });
  const token = localStorage.getItem("access_token");
  const router = useRouter();

  // Obtener todos los patrocinadores disponibles
  const fetchPatrocinadores = async () => {
    try {
      const respuesta = await fetch('https://inf281-production.up.railway.app/evento/patrocinador', {headers: {"Authorization": `Bearer ${token}`}});
      const datos = await respuesta.json();
      setPatrocinadores(
        datos.map((p) => ({
          value: p.id_patrocinador,
          label: `${p.razon_social} - ${p.institucion}`,
          ...p,
        }))
      );
    } catch (error) {
      console.error('Error al obtener patrocinadores:', error);
      toast.error('❌ Error al obtener patrocinadores');
    }
  };

  // Obtener los patrocinadores asociados al evento cuando `eventoId` cambia
  useEffect(() => {
    fetchPatrocinadores();
    const fetchPatrocinadoresEvento = async () => {
      if (!eventoId) return;
      try {
        if (!token) {throw new Error("Acceso denegado");}
        const respuesta = await fetch(`https://inf281-production.up.railway.app/evento/patrocinador/evento/${eventoId}`, {headers: {"Authorization": `Bearer ${token}`}});
        const datos = await respuesta.json();
        setAddedPatrocinadores(
          datos.map((p) => ({
            value: p.id_patrocinador,
            label: `${p.razon_social} - ${p.institucion}`,
            ...p,
          }))
        );
      } catch (error) {
        console.error('Error al obtener patrocinadores del evento:', error);
        toast.error('❌ Error al obtener patrocinadores del evento');
      }
    };
    fetchPatrocinadoresEvento();
  }, [eventoId]);

  // Agregar patrocinador seleccionado
  const handleAgregarPatrocinador = () => {
    if (!selectedPatrocinador) return;
    const patrocinadorSeleccionado = patrocinadores.find(
      (patrocinador) => patrocinador.id_patrocinador === selectedPatrocinador.value
    );
    if (
      patrocinadorSeleccionado &&
      !addedPatrocinadores.some((p) => p.value === patrocinadorSeleccionado.value)
    ) {
      const nuevosPatrocinadores = [...addedPatrocinadores, patrocinadorSeleccionado];
      setAddedPatrocinadores(nuevosPatrocinadores);
      setSelectedPatrocinador(null); // Limpiar la selección
      toast.success('✅ Patrocinador añadido');
    }
  };

  // Eliminar patrocinador de la lista de patrocinadores añadidos
  const handleQuitarPatrocinador = (index) => {
    const nuevosPatrocinadores = addedPatrocinadores.filter((_, i) => i !== index);
    setAddedPatrocinadores(nuevosPatrocinadores);
    toast.warning('⚠️ Patrocinador eliminado');
  };

  // Manejo de cambio de los campos de nuevo patrocinador
  const handleNuevoPatrocinadorChange = (e) => {
    const { name, value } = e.target;
    setNuevoPatrocinador({ ...nuevoPatrocinador, [name]: value });
  };

  // Agregar nuevo patrocinador
  const handleAgregarNuevoPatrocinador = async () => {
    if (!nuevoPatrocinador.razon_social || !nuevoPatrocinador.institucion) {
      alert('❌ Por favor, completa todos los campos.');
      return;
    }

    try {
      if (!token) {throw new Error("Acceso denegado");}
      const res = await fetch('https://inf281-production.up.railway.app/evento/patrocinador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(nuevoPatrocinador),
      });

      if (!res.ok) throw new Error('Error al agregar el patrocinador');

      const nuevoPatrocinadorRespuesta = await res.json();

      // Agregar el patrocinador recién creado a la lista sin necesidad de hacer otra solicitud
      const patrocinadorNuevo = {
        value: nuevoPatrocinadorRespuesta.id_patrocinador,
        label: `${nuevoPatrocinadorRespuesta.razon_social} - ${nuevoPatrocinadorRespuesta.institucion}`,
        ...nuevoPatrocinadorRespuesta,
      };
      setPatrocinadores(prev => [...prev, patrocinadorNuevo]);

      // Limpiar el formulario y cerrar el modal
      setNuevoPatrocinador({
        razon_social: '',
        institucion: '',
      });
      setShowAddForm(false);

      fetchPatrocinadores();
      toast.success('✅ Patrocinador agregado exitosamente!');
    } catch (error) {
      console.error('Error al agregar patrocinador:', error);
      toast.error('❌ Ocurrió un error al agregar el patrocinador.');
    }
  };

  // Enviar los cambios de patrocinadores
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const patrocinadoresTransformados = addedPatrocinadores.map(patrocinador => ({
      id_patrocinador: patrocinador.id_patrocinador,
    }));
    
    try {
      if (!token) {throw new Error("Acceso denegado");}
      const response = await fetch(`https://inf281-production.up.railway.app/evento/patrocinador/evento/${eventoId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json', "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(patrocinadoresTransformados), 
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

  // Volver a la página anterior
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 2: Seleccionar patrocinadores</h3>

        {/* Select de patrocinadores existentes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Selecciona un Patrocinador</label>
          <Select
            options={patrocinadores}
            value={selectedPatrocinador}
            onChange={setSelectedPatrocinador}
            placeholder="Busca o selecciona un patrocinador"
            isSearchable
          />
        </div>

        {/* Botón para agregar patrocinador de la lista */}
        <div className="flex flex-col sm:flex-row justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-8">
          <button
            type="button"
            onClick={handleAgregarPatrocinador}
            className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Añadir Patrocinador
          </button>

          {/* Botón para mostrar formulario de nuevo patrocinador */}
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
          >
            Crear Nuevo Patrocinador
          </button>
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
            <div className="flex justify-center">
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

        {/* Mostrar patrocinadores añadidos */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Patrocinadores Añadidos</h3>
          <ul>
            {addedPatrocinadores.map((patrocinador, index) => (
              <li key={patrocinador.id_patrocinador} className="flex justify-between items-center mb-2">
                <span>{patrocinador.label}</span>
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

export default EditarPatrocinadoresEvento;
