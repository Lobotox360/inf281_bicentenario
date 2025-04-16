'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditarInformacionEvento from './editarInfomacionEvento';
import EditarPatrocinadoresEvento from './editarPatrocinadoresEvento';
import EditarFotoEvento from './editarFotoEvento';
import EditarUbicacionEvento from './editarUbicacion';
import EditarCategoriasEvento from './editarCategoriasEvento';
import EditarExpositoresEvento from './editarExpositoresEvento';
import EditarTelefonosEvento from './editarTelefonosEvento';

const EditarEvento = ({ eventoId }) => {
  const router = useRouter();
  const [pasoActual, setPasoActual] = useState(1); // Estado para controlar el paso
  const [eventoData, setEventoData] = useState({
    informacion: {},
    patrocinadores: [],
    expositores: [],
    categorias: [],
    telefonos: [],
    ubicacion: { 
      descripcion: '', 
      ubicacion: '', 
      departamento: ''  // Descripción de la ubicación
    },
    foto: null
  }); // Mantén todos los datos en un solo objeto
  useEffect(() => {
    // Replace with the API request to fetch the event data using `eventoId`
    const fetchEventoData = async () => {
      try {
        const res = await fetch(`https://inf281-production.up.railway.app/eventos/${eventoId}`);
        const data = await res.json();
        setEventoData(data); // Set the data you get from the backend
      } catch (error) {
        console.error('Error fetching evento data:', error);
      }
    };

    if (eventoId) {
      fetchEventoData();
    }
  }, [eventoId]);
  
  // Función para avanzar al siguiente paso
  const siguientePaso = () => {
    setPasoActual(pasoActual + 1);
  };

  const anteriorPaso = () => {
    setPasoActual(pasoActual - 1);
  };

  // Función para actualizar datos del evento en cada paso
  const handleUpdateData = (section, data) => {
    setEventoData((prevData) => ({
      ...prevData,
      [section]: data
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-white text-2xl font-semibold text-center mb-4">Editar el Evento</h2>

      {/* Muestra la sección de información del evento */}
      {pasoActual === 1 && <EditarInformacionEvento  siguientePaso={siguientePaso} eventoId={eventoId} />}

      {/* Muestra la sección de ubicación */}
      {pasoActual === 2 && <EditarPatrocinadoresEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} eventoId={eventoId}  />}
 
      {pasoActual === 3 && <EditarExpositoresEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso}  eventoId={eventoId}/>}

      {pasoActual === 4 && <EditarCategoriasEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} eventoId={eventoId}/>}
      
      {pasoActual === 5 && <EditarTelefonosEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} eventoId={eventoId}/>}

      {pasoActual === 6 && <EditarUbicacionEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} eventoId={eventoId}/>}

      {pasoActual === 7 && <EditarFotoEvento anteriorPaso={anteriorPaso} eventoId={eventoId}/>}
      
      {/* Aquí puedes agregar más pasos, como Expositores y Patrocinadores 
      {pasoActual === 4 && <EditarCategoriasEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} eventoId={eventoId}/>}
      
      {pasoActual === 5 && <EditarTelefonosEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} eventoId={eventoId}/>}*/
      }
    </div>
  );
};

export default EditarEvento;
