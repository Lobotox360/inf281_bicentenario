import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CalendarioUsuario({ id_usuario }) {
  const [eventos, setEventos] = useState([]);
  const [vistaActual, setVistaActual] = useState('dayGridMonth');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [linkReunion, setLinkReunion] = useState(null);
  const calendarioRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const token = localStorage.getItem('access_token');
    const fetchEventos = async () => {
      try {
        if (!token) {
          throw new Error('Acceso denegado');
        }
        const res = await fetch(`https://inf281-production.up.railway.app/agenda/${id_usuario}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        const eventosFormateados = data.map((evento) => {
          const fechaInicio = new Date(evento.Eventos.hora_inicio);
          const fechaFin = new Date(evento.Eventos.hora_fin);
          return {
            id: evento.id_evento.toString(),
            title: evento.actividades,
            start: fechaInicio.toISOString(),
            end: fechaFin.toISOString(),
            reunionIniciada: evento.Eventos.reunion_iniciada,
            link_reunion: evento.Eventos.link_reunion,
          };
        });

        setEventos(eventosFormateados);
      } catch (error) {
        toast.error('Error al cargar eventos del usuario:', error);
      }
    };

    if (id_usuario) fetchEventos();
  }, [id_usuario]);

  const handleVistaDiaria = (e) => {
    const apiCalendario = calendarioRef.current?.getApi();
    apiCalendario?.changeView('timeGridDay', e.date);
    setVistaActual('timeGridDay');
  };

  const volverAlMes = () => {
    const calendarApi = calendarioRef.current?.getApi();
    calendarApi?.changeView('dayGridMonth');
    setVistaActual('dayGridMonth');
  };

  const handleIngresarEvento = (info) => {
    const eventoId = info.event.id;
    const evento = info.event;
    setEventoSeleccionado(evento);
    setLinkReunion(info.event.extendedProps);
    setMostrarModal(true); 
  };

  const cerrarModal = () => {
    setMostrarModal(false); 
  };

  const handleIngresarEventoVirtual = async () => {
    const token = localStorage.getItem('access_token');
    // Verificar si la reunión ha comenzado
    console.log(linkReunion.reunionIniciada);
    if (!linkReunion.reunionIniciada) {
      toast.error('La reunión aún no ha comenzado o ya ha finalizado. Intenta más tarde.')
      return 
    }
    window.open(linkReunion.link_reunion, '_blank')
    try {
      if (!token) {throw new Error("Acceso denegado");}
      const response = await fetch('https://inf281-production.up.railway.app/agenda/asistencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id_usuario: id_usuario, 
          id_evento: parseInt(eventoSeleccionado.info.event.id)   
        }),
      })
    } catch (error) {
      console.error('Error al registrar la asistencia:', error)
      toast.error('Hubo un error con la conexión');
    }
  }

  return (
    <div>
      <div className="p-4 mb-4 bg-white rounded-xl shadow-lg w-full max-w-[1100px] mx-auto" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">Mi Calendario Personal</h2>

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
            center: 'title',
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
            <p><strong>Reunión Iniciada:</strong> {linkReunion.reunionIniciada ? 'Sí' : 'No'}</p>
            <p><strong>Link de la Reunión:</strong> <a onClick={handleIngresarEventoVirtual} rel="noopener noreferrer" target="_blank" className="cursor-pointer text-blue-500 hover:text-purple-500">Ir a la reunión</a></p>
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
      <ToastContainer />
    </div>
  );
}
