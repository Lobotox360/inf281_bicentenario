// app/mi-calendario/page.tsx
'use client'

import dynamic from 'next/dynamic'
import CalendarioUsuario from '../componentes/calendario/calendario'
import Navbar from '../componentes/inicio/navbar'

export default function MiCalendarioPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-35">
      <CalendarioUsuario />
    </div>
  )
}
