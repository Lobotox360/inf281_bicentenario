'use client'; 

import { useParams } from 'next/navigation';
import EditarInformacionEvento from '../../../../componentes/eventos/editar/editarInfomacionEvento';

const EditarInformacionEventoPagina = () => {
  const { id } = useParams();

  return (
    <div>
        <h3 className='text-white text-3xl font-semibold text-center p-4'>EDITAR EVENTO</h3>
        <EditarInformacionEvento eventoId={id} />
    </div>
  );
};

export default EditarInformacionEventoPagina;
