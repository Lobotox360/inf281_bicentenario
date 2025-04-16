'use client'; 

import { useParams } from 'next/navigation';
import EditarTelefonosEvento from '../../../../componentes/eventos/editar/editarTelefonosEvento';

const EditarInformacionEventoPagina = () => {
  const { eventoId } = useParams(); 

  return (
    <div>
        <h3 className='text-white text-3xl font-semibold text-center p-4'>EDITAR EVENTO</h3>
        <EditarTelefonosEvento eventoId={eventoId} />
    </div>
  );
};

export default EditarInformacionEventoPagina;
