// app/mi-calendario/page.jsx
'use client'
import Navbar from "../componentes/inicio/navbar"
import PiePagina from "../componentes/inicio/footer"
import Podio from "../componentes/puntuacion/puntuacion"

export default function PuntuacionesPagina() {
  return (
    <div>
      <Navbar />
      <Podio />
      <PiePagina/>
    </div>
  )
} 
