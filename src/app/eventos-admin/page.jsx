// app/mi-calendario/page.jsx
'use client'
import EventosAdmin from "../componentes/crud-eventos/eventos-crud"

export default function RolesPagina() {
  return (
    <div className="min-h-screen flex flex-col items-center py-35">
      <EventosAdmin/>
    </div>
  )
} 
