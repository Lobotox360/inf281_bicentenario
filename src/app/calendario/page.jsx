'use client'


import Navbar from '../componentes/inicio/navbar'
import Calendario from '../componentes/calendario/calendario'

export default function CalendarioPagina() {
  return (
    <div className="min-h-screen flex flex-col items-center py-35">
      <Navbar />
      <Calendario/>
    </div>
  )
}
