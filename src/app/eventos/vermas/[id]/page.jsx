'use client';

import { useParams } from 'next/navigation';
import VerMasEvento from '../../../componentes/eventos/vermas';

export default function VerMasEventoPagina() {
  const { id } = useParams();

  return (
    <VerMasEvento eventoId={id}/>
  );
}
