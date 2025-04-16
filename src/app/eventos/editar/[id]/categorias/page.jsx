'use client'; 

import { useParams } from 'next/navigation';
import EditarCategoriasEvento from '../../../../componentes/eventos/editar/editarCategoriasEvento';

const EditarInformacionEventoPagina = () => {
  const { eventoId } = useParams(); 

  return (
    <div>
        <h3 className='text-white text-3xl font-semibold text-center p-4'>EDITAR EVENTO</h3>
        <EditarCategoriasEvento eventoId={eventoId} />
    </div>
  );
};

export default EditarInformacionEventoPagina;
