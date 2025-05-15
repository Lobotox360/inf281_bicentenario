import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import AOS from 'aos';import 'aos/dist/aos.css';
import { useState, useEffect, useRef } from 'react'

export default function Calendario() {
  const [eventos, setEventos] = useState([])
  const [vistaActual, setVistaActual] = useState('dayGridMonth')
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const calendarioRef = useRef(null)

  // Obtener eventos desde la API
  useEffect(() => {
    AOS.init({ duration: 1000 });
    const fetchEventos = async () => {
      try {
        const res = await fetch(`https://inf281-production.up.railway.app/eventos/calendario/evento`)
        const data = await res.json()
        const eventosFormateados = data.map(evento => {
          const fechaInicio = new Date(evento.hora_inicio)
          const fechaFin = new Date(evento.hora_fin)
          return {
            id: evento.id_evento.toString(),
            title: evento.titulo,
            start: fechaInicio.toISOString(),
            end: fechaFin.toISOString(),
            backgroundColor: '#009472',
            borderColor: '#009472',
          }
        })

        setEventos(eventosFormateados)
      } catch (error) {
        console.error('❌ Error al cargar eventos del usuario:', error)
      }
    }

    fetchEventos()
  }, [])

  // Cambiar vista al hacer clic en un día
  const handleVistaDiaria = (arg) => {
    const apiCalendario = calendarioRef.current?.getApi()
    apiCalendario?.changeView('timeGridDay', arg.date)
    setVistaActual('timeGridDay')
  }

  // Función para volver a la vista mensual
  const volverAlMes = () => {
    const calendarApi = calendarioRef.current?.getApi()
    calendarApi?.changeView('dayGridMonth')
    setVistaActual('dayGridMonth')
  }

  const handleIngresarEvento = (info) => {
    const eventoId = info.event.id;
    const evento = info.event;
    setEventoSeleccionado(evento);
    console.log(evento);
    setMostrarModal(true); 
  };

  const cerrarModal = () => {
    setMostrarModal(false); 
  };

  return (
    <div>
      <div className="p-4 bg-white rounded-xl shadow-lg w-full max-w-[1100px] mb-4 mx-auto" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-500">
          Calendario general
        </h2>

        {vistaActual === 'timeGridDay' && (
          <div className="flex justify-end mb-2">
            <button 
              onClick={volverAlMes} 
              className="cursor-pointer bg-orange-500 hover:bg-yellow-400 text-white px-4 py-2 rounded w-full sm:w-auto md:w-auto lg:w-auto"
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
          dateClick={handleVistaDiaria}
          eventColor="#10e685"
          dayMaxEvents={3}
          headerToolbar={{
            right: 'today',
            left: 'prev,next',
            center: 'title'
          }}
          headerClassNames="flex flex-col sm:flex-row sm:justify-between items-center sm:items-center gap-2 sm:gap-4"
          eventClick={handleIngresarEvento}
        />
        
      </div>
      {/* Modal */}
      {mostrarModal && eventoSeleccionado && (
          <div className="fixed flex bg-black/70 inset-0 justify-center items-center z-50" data-aos="fade">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
              <h3 className="text-center text-md font-bold mb-4">{eventoSeleccionado.title}</h3>
              <p><strong>Hora de Inicio:</strong> {new Date(eventoSeleccionado.start).toLocaleString()}</p>
              <p><strong>Hora de Fin:</strong> {new Date(eventoSeleccionado.end).toLocaleString()}</p>
              <p><strong>Ver mas:</strong> <a href={`/eventos/vermas/${eventoSeleccionado.id}`} className="cursor-pointer text-blue-500 hover:text-purple-500">Ir al evento</a></p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={cerrarModal}
                  className="cursor-pointer bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
