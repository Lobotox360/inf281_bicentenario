import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect, useRef } from 'react'
import AOS from 'aos';import 'aos/dist/aos.css';

export default function CalendarioUsuario({ id_usuario }) {
  const [eventos, setEventos] = useState([])
  const [vistaActual, setVistaActual] = useState('dayGridMonth')
  const calendarioRef = useRef(null)

  // Obtener eventos desde la API
  useEffect(() => {
    AOS.init({ duration: 1000 });
    const fetchEventos = async () => {
      try {
        const res = await fetch(`https://inf281-production.up.railway.app/agenda/${id_usuario}`)
        const data = await res.json()
        const eventosFormateados = data.map(evento => {
          const fechaInicio = new Date(evento.Eventos.hora_inicio)
          const fechaFin = new Date(evento.Eventos.hora_fin)
          return {
            id: evento.id_evento.toString(),
            title: evento.actividades,
            start: fechaInicio.toISOString(),
            end: fechaFin.toISOString(),
            url: "#",
            backgroundColor: 'blue',
            reunionIniciada: evento.Eventos.reunion_iniciada,  // Añadido: validación si la reunión ha comenzado
            link_reunion: evento.Eventos.link_reunion, // Guardamos el enlace solo aquí
          }
        })

        setEventos(eventosFormateados)
      } catch (error) {
        console.error('❌ Error al cargar eventos del usuario:', error)
      }
    }

    if (id_usuario) fetchEventos()
  }, [id_usuario])

  // Cambiar vista al hacer clic en un día
  const handleDateClick = (arg) => {
    const calendarApi = calendarioRef.current?.getApi()
    calendarApi?.changeView('timeGridDay', arg.date)
    setVistaActual('timeGridDay')
  }

  // Función para volver a la vista mensual
  const volverAlMes = () => {
    const calendarApi = calendarioRef.current?.getApi()
    calendarApi?.changeView('dayGridMonth')
    setVistaActual('dayGridMonth')
  }

  // Manejo de evento de clic (cuando se hace clic en un evento)
  const handleEventClick = async (info) => {
    const eventoId = info.event.id
    const evento = info.event.extendedProps

    // Verificar si la reunión ha comenzado
    if (!evento.reunionIniciada) {
      alert('La reunión aún no ha comenzado o ya ha finalizado. Intenta más tarde.')
      return 
    }

    // Si la reunión ha comenzado, abrir el enlace
    window.open(evento.link_reunion, '_blank')

    // Registrar asistencia
    try {
      const response = await fetch('https://inf281-production.up.railway.app/agenda/asistencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: id_usuario, 
          id_evento: parseInt(eventoId)   
        }),
      })
    } catch (error) {
      console.error('❌ Error al registrar la asistencia:', error)
      alert('Hubo un error con la conexión')
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-[1100px] mx-auto" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-500">
        Mi Calendario Personal
      </h2>

      {vistaActual === 'timeGridDay' && (
        <div className="flex justify-end mb-2">
          <button 
            onClick={volverAlMes} 
            className="bg-orange-500 hover:bg-yellow-400 text-white px-4 py-2 rounded w-full sm:w-auto md:w-auto lg:w-auto"
          >
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
        headerToolbar={{
          right: 'today',
          left: 'prev,next',
          center: 'title'
        }}
        headerClassNames="flex flex-col sm:flex-row sm:justify-between items-center sm:items-center gap-2 sm:gap-4"
        eventClick={handleEventClick} // Evento de clic para registrar la asistencia
      />
    </div>
  )
}
