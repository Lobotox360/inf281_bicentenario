// app/mi-calendario/page.jsx
'use client'
import EventosAdmin from "../componentes/crud-eventos/crud"
import Navbar from "../componentes/inicio/navbar"

export default function RolesPagina() {
  return (
    <div className="min-h-screen flex flex-col items-center py-35">
      <Navbar/>
      <EventosAdmin/>
    </div>
  )
} 
