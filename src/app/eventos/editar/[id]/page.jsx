// app/eventos/editar/[id]/page.jsx

import EditarEvento from "../../../componentes/eventos/editar/editar";

export default async function PaginaEditarEvento({ params }) {
  // Desestructuramos el id desde params
  const { id } = params;

  return (
    <div>
      <EditarEvento eventoId={id} /> 
    </div>
  );
}
