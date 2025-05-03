'use client'; 

import { useParams } from 'next/navigation';
import EditarTelefonosEvento from '../../../../componentes/eventos/editar/editarTelefonosEvento';

const EditarTelefonosEventoPagina = () => {
  const { id } = useParams(); 

  return (
    <div>
        <h3 className='text-white text-3xl font-semibold text-center p-4'>EDITAR EVENTO</h3>
        <EditarTelefonosEvento eventoId={id} />
    </div>
  );
};

export default EditarTelefonosEventoPagina;
