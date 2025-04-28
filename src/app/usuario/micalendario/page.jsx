// app/mi-calendario/page.jsx
'use client'

import CalendarioUsuario from '../../componentes/usuario/mi-agenda'
import Navbar from '../../componentes/inicio/navbar'
import PiePagina from '@/app/componentes/inicio/footer'

export default function MiCalendarioPagina() {
  return (
    <div className="min-h-screen flex flex-col items-center mt-25">
      <Navbar />
      <CalendarioUsuario />
      <PiePagina/>
    </div>
  )
} 
