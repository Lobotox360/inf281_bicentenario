// app/eventos/editar/[id]/page.jsx

import Sidebar from "@/app/componentes/dashboard/sidebar-admin";
import EditarEvento from "../../../componentes/eventos/editar/editar";
import PiePagina from "@/app/componentes/inicio/footer";

export default async function PaginaEditarEvento({ params }) {
  const { id } = params;

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 overflow-auto">
          <EditarEvento eventoId={id} />
        </div>
      </div>
      <PiePagina/>
    </div>
  );
}
