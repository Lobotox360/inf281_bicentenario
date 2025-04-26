// app/mi-calendario/page.jsx
'use client'

import CalendarioUsuario from '../../componentes/usuario/mi-agenda'
import Navbar from '../../componentes/inicio/navbar'

export default function MiCalendarioPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-35">
      <Navbar />
      <CalendarioUsuario />
    </div>
  )
} 
