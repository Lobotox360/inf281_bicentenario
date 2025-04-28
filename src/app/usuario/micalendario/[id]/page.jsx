'use client'

import { useEffect, useState } from 'react'
import CalendarioUsuario from '../../../componentes/usuario/mi-agenda'
import Navbar from '../../../componentes/inicio/navbar'
import PiePagina from '@/app/componentes/inicio/footer'

export default function MiCalendarioPage() {
  const [idUsuario, setIdUsuario] = useState(null)

  useEffect(() => {
    const id = localStorage.getItem('id_user')
    setIdUsuario(id)
  }, [])

  return (
    <div className="min-h-screen flex flex-col mt-35">
      <Navbar />
      {idUsuario ? (
        <CalendarioUsuario id_usuario={idUsuario} />
      ) : (
        <p className="text-center mt-10">🔄 Cargando tu calendario...</p>
      )}
      <PiePagina/>
    </div>
  )
}
