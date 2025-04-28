'use client';

import { useParams } from 'next/navigation';
import VerMasEvento from '../../../componentes/eventos/vermas';
import Navbar from '@/app/componentes/inicio/navbar';
import PiePagina from '@/app/componentes/inicio/footer';

export default function VerMasEventoPagina() {
  const { id } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <VerMasEvento eventoId={id}/>
      <PiePagina/>
    </div>
  );
}
