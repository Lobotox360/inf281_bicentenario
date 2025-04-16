'use client';
import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';

export default function NoticiasSlider() {
  const noticias = ['Noticia 1', 'Noticia 2', 'Noticia 3', 'Noticia 4', 'Noticia 5', 'Noticia 6'];

  const [swiperReady, setSwiperReady] = useState(false);
  const anteriorRef = useRef(null);
  const siguienteRef = useRef(null);
  const swiperRef = useRef(null); // Nuevo: para acceder al swiper

  // Se asegura de que los refs estén listos antes de inicializar la navegación
  useEffect(() => {
    if (
      swiperRef.current &&
      anteriorRef.current &&
      siguienteRef.current &&
      swiperRef.current.params?.navigation
    ) {
      swiperRef.current.params.navigation.prevEl = anteriorRef.current;
      swiperRef.current.params.navigation.nextEl = siguienteRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }

    setSwiperReady(true);
  }, []);

  return (
    <section className="p-10">
      <h2 className="text-3xl font-bold text-center mb-6">Noticias del Bicentenario</h2>
      <div className="relative">
        {/* Botón izquierdo */}
        <button ref={anteriorRef} className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-black px-3 py-3 rounded-full hover:bg-gray-800">
          <FaArrowLeft />
        </button>

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
            {noticias.map((noticia, idx) => (
              <SwiperSlide key={idx}>
                <div className="p-4 bg-green-500 rounded-lg shadow-md text-center">
                  <h2 className="text-xl font-bold mb-4">EVENTOS EN TENDENCIA</h2>
                  <img src="/assets/simon.jpg" alt="Imagen de la noticia" className="max-w-full h-auto mb-4 mx-auto"/>
                  <p className="text-base text-white">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime libero, nam sit nisi sequi quas reiciendis quo expedita, enim quia sapiente nostrum distinctio a eaque delectus recusandae, qui accusamus placeat.</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Botón derecho */}
        <button ref={siguienteRef} className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-3 rounded-full hover:bg-gray-800">
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
}
