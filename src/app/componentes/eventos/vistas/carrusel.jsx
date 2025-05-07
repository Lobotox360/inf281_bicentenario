'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';import 'swiper/css/navigation';
import { FaArrowLeft, FaArrowRight, FaEdit } from 'react-icons/fa';
import AOS from 'aos'; import 'aos/dist/aos.css';
import Link from 'next/link';
import MapaEvento from './mapa';
import ModuloComentarios from './comentarios-carrusel';

const CarruselEventos = ({ departamento, modalidad, estado, montoMinimo, montoMaximo }) => {
  const [eventos, setEventos] = useState([]);
  const [carga, setCarga] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [indexActual, setIndexActual] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const role = localStorage.getItem('rol');
    setUserRole(role);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const fetchEventos = async () => {
      try {
        const respuesta = await fetch('https://inf281-production.up.railway.app/eventos');
        const datos = await respuesta.json();
        const eventosFiltrados = datos.filter(evento => {
          const filtrarPorDepartamento = evento.Ubicacion?.departamento === departamento;
          const filtrarPorModalidad = modalidad ? evento.modalidad === modalidad : true;
          const filtrarPorEstado = estado ? evento.estado === estado : true;
          const filtrarPorMonto = (montoMinimo ? evento.costo >= montoMinimo : true) && (montoMaximo ? evento.costo <= montoMaximo : true);
          
          return filtrarPorDepartamento && filtrarPorModalidad && filtrarPorEstado && filtrarPorMonto;
        });
        setEventos(eventosFiltrados);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      } finally {
        setCarga(false);
      }
    };
    
    fetchEventos();
  }, [departamento, modalidad, estado, montoMinimo, montoMaximo]);

  if (carga) {
    return <p className='text-center text-white text-xl font-semibold'>Cargando eventos...</p>;
  }

  if (eventos.length === 0) {
    return (<p className='text-center text-white text-xl font-semibold'>No hay eventos disponibles en {departamento}.</p>);
  }

  const handleSiguiente = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleAnterior = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className="relative p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white text-3xl font-semibold text-center mb-4" data-aos="fade-up">EVENTOS EN {departamento.toUpperCase()}</h2>
        
        <Swiper spaceBetween={50} slidesPerView={1} navigation={false} ref={swiperRef} onSlideChange={(swiper) => setIndexActual(swiper.activeIndex)}>
          {eventos.map((evento) => (
            <SwiperSlide key={evento.id_evento}>
              <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg animate-fadeIn" data-aos="fade-up">
                <h2 className="text-xl font-semibold text-center">{evento.titulo}</h2>
                <div className="flex flex-col md:flex-row justify-between items-center bg-white">
                  <div className="relative order-1 md:order-2">
                    <Image src={evento.foto_evento} alt="Evento" width={500} height={320} className="rounded-lg"/>
                  </div>
                  <div className="w-full px-6 order-2 md:order-1">
                    <p className="text-gray-600 mt-2 mx-10 text-center">{evento.descripcion}</p>
                    <p className="text-gray-600 mt-2 mx-10 text-left"><strong>HORARIO: </strong> {new Date(evento.hora_inicio).toLocaleTimeString()} a {new Date(evento.hora_fin).toLocaleTimeString()}</p>
                    <p className="text-gray-600 mt-2 mx-10 text-left"><strong>FECHA: </strong>{new Date(evento.hora_inicio).toLocaleDateString()}</p>
                    <p className="text-gray-600 mt-2 mx-10 text-left"><strong>ESTADO: </strong>{evento.estado} <strong>MODALIDAD: </strong>{evento.modalidad}</p>
                    <p className="text-gray-600 mt-2 mx-10 text-left"><strong>COSTO: </strong>{evento.costo} Bs.</p>
                  </div>
                </div>
                {/* Botones de navegación personalizados */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pl-4">
                  <button onClick={handleAnterior} className="cursor-pointer bg-red-500 text-white p-3 rounded-full hover:bg-yellow-500">
                    <FaArrowLeft />
                  </button>
                </div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 pr-4">
                  <button onClick={handleSiguiente} className="cursor-pointer bg-red-500 text-white p-3 rounded-full hover:bg-yellow-500">
                    <FaArrowRight />
                  </button>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-center space-x-4 py-4">
                  <Link href={`/eventos/vermas/${evento.id_evento}`} className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400">
                    VER MÁS
                  </Link>
                  {(userRole === 'Administrador' || userRole === 'administrador_eventos') && (
                    <Link href={`/eventos/editar/${evento.id_evento}`}>
                      <button className="cursor-pointer text-yellow py-2 px-6 rounded-full hover:text-red-500">
                        <FaEdit size={20} />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mapa */}
        {eventos[indexActual].modalidad !== 'virtual' && (
          <div className="flex justify-center mt-8" data-aos="fade-up">
            <MapaEvento direccion={eventos[indexActual]?.Ubicacion?.ubicacion} latitud={eventos[indexActual]?.Ubicacion?.latitud} longitud={eventos[indexActual]?.Ubicacion?.longitud} />
          </div>
        )}
        {/* Comentarios */}
        <h2 className="p-4 text-2xl font-semibold text-white text-center" data-aos="fade-up">COMENTARIOS</h2>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-2 mb-4" data-aos="fade-up">
          <ModuloComentarios eventoId = {eventos[indexActual].id_evento}/>
        </div>
      </div>
    </div>
  );
};

export default CarruselEventos;
