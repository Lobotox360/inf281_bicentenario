// app/mi-calendario/page.jsx
'use client'
import EventosAdmin from "../componentes/crud-eventos/crud"
import Sidebar from "../componentes/dashboard/sidebar-admin"
export default function AdministracionEventosPagina() {
  return (
    <div className="flex">
      <Sidebar/>
      <EventosAdmin/>
    </div>
  )
} 
