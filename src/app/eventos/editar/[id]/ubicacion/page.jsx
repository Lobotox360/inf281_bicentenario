'use client'; 

import { useParams } from 'next/navigation';
import EditarUbicacionEvento from '../../../../componentes/eventos/editar/editarUbicacion';

const EditarInformacionEventoPagina = () => {
  const { id } = useParams(); 

  return (
    <div>
        <h3 className='text-white text-3xl font-semibold text-center p-4'>EDITAR EVENTO</h3>    
        <EditarUbicacionEvento eventoId={id} />
    </div>
  );
};

export default EditarInformacionEventoPagina;
