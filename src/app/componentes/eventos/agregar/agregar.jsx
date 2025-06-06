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
  const [pasoActual, setPasoActual] = useState(1); 
  const [eventoData, setEventoData] = useState({
    informacion: {},
    patrocinadores: [],
    expositores: [],
    categorias: [],
    telefonos: [],
    ubicacion: { 
      descripcion: '', 
      ubicacion: '', 
      departamento: '',
      latitud: '',
      longitud: ''  
    },
    foto: null
  });

  const siguientePaso = () => {
    if (pasoActual === 5 && eventoData.informacion.modalidad === 'virtual') {
      setPasoActual(7); 
    } else {
      setPasoActual(pasoActual + 1);
    }
  };


  const anteriorPaso = () => {
    if (pasoActual === 7 && eventoData.informacion.modalidad === 'virtual') {
      setPasoActual(5);
    } else {
      setPasoActual(pasoActual - 1);
    }
  };

  const handleUpdateData = (section, data) => {
    setEventoData((prevData) => ({
      ...prevData,
      [section]: data
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-white text-2xl font-semibold text-center mb-4">Agregar Nuevo Evento</h2>

      {pasoActual === 1 && <InformacionEvento siguientePaso={siguientePaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 2 && <PatrocinadoresEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 3 && <ExpositoresEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 4 && <CategoriasEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}
      
      {pasoActual === 5 && <TelefonosEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 6 && <UbicacionEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}

      {pasoActual === 7 && <FotoEvento siguientePaso={siguientePaso} anteriorPaso={anteriorPaso} handleUpdateData={handleUpdateData} eventoData={eventoData} />}
      
    </div>
  );
};

export default AgregarEvento;
