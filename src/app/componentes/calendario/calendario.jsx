'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../inicio/navbar'

export default function CalendarioUsuario() {
  const [eventos, setEventos] = useState([])
  const [vistaActual, setVistaActual] = useState('dayGridMonth')
  const calendarioRef = useRef(null)

  useEffect(() => {
    setEventos([
      {
        id: '1',
        title: 'Reunión de equipo',
        start: '2025-04-15T10:00:00',
        end: '2025-04-15T11:30:00'
      },
      {
        id: '2',
        title: 'Reunión de equipo',
        start: '2025-04-15T11:30:00',
        end: '2025-04-15T12:30:00'
      },
      {
        id: '3',
        title: 'Reunión de equipo',
        start: '2025-04-15T12:30:00',
        end: '2025-04-15T14:00:00'
      },
      {
        id: '4',
        title: 'Estudio bíblico',
        start: '2025-04-18T18:00:00',
        end: '2025-04-18T19:00:00'
      }
    ])
  }, [])

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
      <Navbar />
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-500">
        Mi Calendario de Eventos
      </h2>

      {vistaActual === 'timeGridDay' && (
        <div className="flex justify-end mb-2">
          <button onClick={volverAlMes} className="bg-orange-500 hover:bg-yellow-400 text-white px-4 py-2 rounded">
            Volver al mes
          </button>
        </div>
      )}

      <div className="p-2">
        <FullCalendar
          ref={calendarioRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventos}
          locale="ES"
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
    </div>
  )
}
