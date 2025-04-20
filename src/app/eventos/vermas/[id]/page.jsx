/*'use client';

import { useParams } from 'next/navigation';
import VerMasEvento from '../../../componentes/eventos/vermas';

export default function VerMasEventoPagina() {
  const { id } = useParams();

  return (
    <VerMasEvento eventoId={id}/>
  );
}*/
'use client';
import { useRouter } from 'next/router';



const VerMasEventoPagina = () => {
  const router = useRouter();
  const { id } = router.query;  
  return (
    <VerMasEvento eventoId={id}/>
  );
};

export default VerMasEventoPagina;
