'use client'; 

import { useParams } from 'next/navigation';
import EditarPatrocinadoresEvento from '../../../../componentes/eventos/editar/editarPatrocinadoresEvento';

const EditarInformacionEventoPagina = () => {
  const { eventoId } = useParams(); 

  return (
    <div>
        <h3 className='text-white text-3xl font-semibold text-center p-4'>EDITAR EVENTO</h3>
        <EditarPatrocinadoresEvento eventoId={eventoId} />
    </div>
  );
};

export default EditarInformacionEventoPagina;
