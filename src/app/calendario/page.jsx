'use client'


import Navbar from '../componentes/inicio/navbar'
import Calendario from '../componentes/calendario/calendario'
import PiePagina from '../componentes/inicio/footer'

export default function CalendarioPagina() {
  return (
    <div className="flex flex-col min-h-screen mt-25">
      <Navbar />
      <Calendario/>
      <PiePagina/>
    </div>
  )
}
