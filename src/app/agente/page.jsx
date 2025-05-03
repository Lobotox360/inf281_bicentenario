// app/mi-calendario/page.jsx
'use client'

import AgenteVirtual from "../componentes/agente/agente-virtual"
import PiePagina from "../componentes/inicio/footer"
import Navbar from "../componentes/inicio/navbar"

export default function AgentePagina() {
  return (
    <div>
      <Navbar/>
      <AgenteVirtual/>
      <PiePagina/>
    </div>
  )
} 
