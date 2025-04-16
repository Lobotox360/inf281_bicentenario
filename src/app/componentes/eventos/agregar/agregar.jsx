'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InformacionEvento from './infomacionEvento';
import PatrocinadoresEvento from './patrocinadoresEvento';
import FotoEvento from './fotoEvento';
import UbicacionEvento from './ubicacion';
import CategoriasEvento from './categoriasEvento';
import ExpositoresEvento from './expositoresEvento';
import TelefonosEvento from './telefonosEvento';

const AgregarEvento = () => {
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
      <h2 className="text-white text-2xl font-semibold text-center mb-4">Agregar Nuevo Evento</h2>

      {/* Muestra la sección de información del evento */}
      {pasoActual === 1 && <InformacionEvento siguientePaso={siguientePaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {/* Muestra la sección de ubicación */}
      {pasoActual === 2 && <PatrocinadoresEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 3 && <ExpositoresEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 4 && <CategoriasEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}
      
      {pasoActual === 5 && <TelefonosEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 6 && <UbicacionEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 7 && <FotoEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}
      
      {/* Aquí puedes agregar más pasos, como Expositores y Patrocinadores */}
    </div>
  );
};

export default AgregarEvento;
