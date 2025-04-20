// componentes/calendario/calendario.jsx
'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect, useRef } from 'react'

export default function CalendarioUsuario({ id_usuario }) {
  const [eventos, setEventos] = useState([])
  const [vistaActual, setVistaActual] = useState('dayGridMonth')
  const calendarioRef = useRef(null)

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch(`https://inf281-production.up.railway.app/agenda/${id_usuario}`)
        const data = await res.json()
        const eventosFormateados = data.map(evento => {
          const fechaInicio = new Date(evento.fecha)
          const fechaFin = new Date(fechaInicio.getTime() + (evento.duracion || 60) * 60000)
          return {
            id: evento.id_evento.toString(),
            title: evento.actividades,
            start: fechaInicio.toISOString(),
            end: fechaFin.toISOString(),
          }
        })

        setEventos(eventosFormateados)
      } catch (error) {
        console.error('❌ Error al cargar eventos del usuario:', error)
      }
    }

    if (id_usuario) fetchEventos()
  }, [id_usuario])

  const handleDateClick = (arg) => {
    const calendarApi = calendarioRef.current?.getApi()
    calendarApi?.changeView('timeGridDay', arg.date)
    setVistaActual('timeGridDay')
  }

  const volverAlMes = () => {
    const calendarApi = calendarioRef.current?.getApi()
    calendarApi?.changeView('dayGridMonth')
    setVistaActual('dayGridMonth')
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-[1100px] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-500">
        Mi Calendario Personal
      </h2>

      {vistaActual === 'timeGridDay' && (
        <div className="flex justify-end mb-2">
          <button onClick={volverAlMes} className="bg-orange-500 hover:bg-yellow-400 text-white px-4 py-2 rounded">
            Volver al mes
          </button>
        </div>
      )}

      <FullCalendar
        ref={calendarioRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventos}
        locale="es"
        height="auto"
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
        }}
        dateClick={handleDateClick}
        eventColor="#10e685"
        dayMaxEvents={3}
      />
    </div>
  )
}
