'use client';
import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import AOS from 'aos'; import 'aos/dist/aos.css';
import 'swiper/css'; import 'swiper/css/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function NoticiasSlider() {
  const [eventos, setEventos] = useState([]);
  const [swiperReady, setSwiperReady] = useState(false);
  const anteriorRef = useRef(null);
  const siguienteRef = useRef(null);
  const swiperRef = useRef(null);

  // Fetch de eventos desde la API
  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetch('https://inf281-production.up.railway.app/eventos')
      .then((response) => response.json())
      .then((data) => {
        const eventosOrdenados = data.sort((a, b) => b.puntuacion - a.puntuacion);
        setEventos(eventosOrdenados);
      })
      .catch((error) => console.error('Error al cargar los eventos:', error));

    if (swiperRef.current && anteriorRef.current && siguienteRef.current && swiperRef.current.params?.navigation) 
    {
      swiperRef.current.params.navigation.prevEl = anteriorRef.current;
      swiperRef.current.params.navigation.nextEl = siguienteRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }

    setSwiperReady(true);
  }, []);

  return (
    <section className="p-2" data-aos="fade-up">
      <h2 className="text-3xl font-bold text-center p-4" data-aos="fade-up">
        Eventos más virales del Bicentenario
      </h2>
      <div className="relative">
        {/* Carrusel */}
        {swiperReady && (
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 4 },
            }}
            modules={[Navigation]}
            navigation={{
              prevEl: anteriorRef.current,
              nextEl: siguienteRef.current,
            }}
          >
            {eventos.length > 0 ? (
              eventos.map((evento) => (
                <SwiperSlide key={evento.id_evento}>
                  <div className="p-4 bg-green-500 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold mb-4">{evento.titulo}</h2>
                    <img
                      src={evento.foto_evento}
                      alt="Imagen del evento"
                      className="max-w-full h-auto mb-4 mx-auto"
                    />
                    <p className="text-base text-white">{evento.descripcion}</p>
                    <p className="text-base text-white">{evento.Ubicacion.departamento}</p>
                    <p className="text-white mt-4">{Array.from({ length: 5 }, (_, index) => {
                        return index < evento.puntuacion ? '⭐' : '☆';
                      }).join(' ')}
                    </p>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <>
              {[...Array(4)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="p-4 bg-green-500 rounded-lg shadow-md text-center">
                    <Skeleton height={30} width={150} className="mb-4" />
                    <Skeleton height={200} className="mb-4" />
                    <Skeleton height={20} width={100} className="mb-2" />
                    <Skeleton height={20} width={80} />
                  </div>
                </SwiperSlide>
              ))}
              </>
            )}
          </Swiper>
        )}

        {/* Botónes de navegacion */}
        <button ref={anteriorRef} className="absolute cursor-pointer z-10 left-0 top-1/2 -translate-y-1/2 bg-black px-3 py-3 rounded-full hover:bg-gray-800">
          <FaArrowLeft />
        </button>
        <button ref={siguienteRef} className="absolute cursor-pointer z-10 right-0 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-3 rounded-full hover:bg-gray-800">
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
}
