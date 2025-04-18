'use client'; 

import { useParams } from 'next/navigation';
import EditarFotoEvento from '../../../../componentes/eventos/editar/editarFotoEvento';

const EditarInformacionEventoPagina = () => {
  const { id } = useParams(); 

  return (
    <div>
        <h3 className='text-white text-3xl font-semibold text-center p-4'>EDITAR EVENTO</h3>
        <EditarFotoEvento eventoId={id} />
    </div>
  );
};

export default EditarInformacionEventoPagina;
