'use client'

import { useEffect, useState } from 'react'
import CalendarioUsuario from '../../componentes/calendario/calendario'
import Navbar from '../../componentes/inicio/navbar'

export default function MiCalendarioPage() {
  const [idUsuario, setIdUsuario] = useState(null)

  useEffect(() => {
    const id = localStorage.getItem('id_user')
    setIdUsuario(id)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center py-35">
      <Navbar />
      {idUsuario ? (
        <CalendarioUsuario id_usuario={idUsuario} />
      ) : (
        <p className="text-center mt-10">🔄 Cargando tu calendario...</p>
      )}
    </div>
  )
}
