'use client'; 

import { useParams } from 'next/navigation';
import EditarExpositoresEvento from '../../../../componentes/eventos/editar/editarExpositoresEvento';

const EditarExpositoresEventoPagina = () => {
  const { id } = useParams(); 

  return (
    <div>
        <h3 className='text-white text-3xl font-semibold text-center p-4'>EDITAR EVENTO</h3>
        <EditarExpositoresEvento eventoId={id} />
    </div>
  );
};

export default EditarExpositoresEventoPagina;
