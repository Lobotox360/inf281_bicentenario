'use client';
import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import NoticiasSlider from '../inicio/carrusel';
import PiePagina from './footer';
import Navbar from "./navbar";

export default function Inicio() {
    const [tiempoRestante, setTiempoRestante] = useState({
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0
    });

    const [estadoApp, setEstadoApp] = useState(null);
    const [mostrarInstalador, setMostrarInstalador] = useState(false);

    useEffect(() => {
        AOS.init({ duracion: 1000 });
        const fechaObjetivo = new Date("2025-08-06T00:00:00");
        const intervalo = setInterval(() => {
            const fechaActual = new Date();
            const diferencia = fechaObjetivo - fechaActual;

            if (diferencia <= 0) {
                clearInterval(intervalo);
                return;
            }

            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
            setTiempoRestante({ dias: dias, horas: horas, minutos: minutos, segundos: segundos });
        }, 1000);

        // Detectar si la PWA puede ser instalada
        const handleVistaInstalador = (e) => {
            e.preventDefault();
            setEstadoApp(e);
            setMostrarInstalador(true); 
        };

        window.addEventListener('vistaInstalador', handleVistaInstalador);

        return () => {
            window.removeEventListener('vistaInstalador', handleVistaInstalador);
        };
    }, []);

    const handleInstalar = () => {
        if (estadoApp) {
            estadoApp.prompt(); 
            estadoApp.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('El usuario ha aceptado instalar la APP');
                } else {
                    console.log('El usuario ha rechazado la instalación de la APP');
                }
                setEstadoApp(null); 
                setMostrarInstalador(false);
            });
        }
    };

    return (
        <div className="text-white">
            <Navbar />

            {/* FRASE  */}
            <section className="text-center mt-40 mb-10 bg-cover bg-center" data-aos="fade-up">
                <h1 className="text-5xl font-extrabold">SOÑAMOS, LUCHAMOS Y VENCEMOS</h1>
            </section>

            {/* Contador */}
            <section className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-center max-w-4xl mx-auto rounded-md p-8" data-aos="fade-up">
                <h2 className="text-4xl font-bold mb-8">CUENTA REGRESIVA</h2>
                <div className="flex justify-center gap-6 flex-wrap">
                    {/* Días */}
                    <div className="flex flex-col items-center">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-black text-3xl font-bold shadow-lg">
                        {tiempoRestante.dias}
                    </div>
                    <span className="mt-2 font-semibold text-lg">Días</span>
                    </div>
                    {/* Horas */}
                    <div className="flex flex-col items-center">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-black text-3xl font-bold shadow-lg">
                        {tiempoRestante.horas}
                    </div>
                    <span className="mt-2 font-semibold text-lg">Horas</span>
                    </div>
                    {/* Minutos */}
                    <div className="flex flex-col items-center">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-black text-3xl font-bold shadow-lg">
                        {tiempoRestante.minutos}
                    </div>
                    <span className="mt-2 font-semibold text-lg">Minutos</span>
                    </div>
                    {/* Segundos */}
                    <div className="flex flex-col items-center">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white text-black text-3xl font-bold shadow-lg">
                        {tiempoRestante.segundos}
                    </div>
                    <span className="mt-2 font-semibold text-lg">Segundos</span>
                    </div>
                </div>
            </section>

            {/* Botón de instalación PWA */}
            {mostrarInstalador && (
                <div className="text-center mt-6">
                    <button
                        onClick={handleInstalar}
                        className="cursor-pointer p-2 bg-green-600 text-white rounded-md hover:bg-green-400"
                    >
                        Instalar Aplicación
                    </button>
                </div>
            )}

            <NoticiasSlider />

            <section className="p-4 text-center" data-aos="fade-up">
                <h2 className="text-3xl font-bold">Contenido Multimedia</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                    {[
                        "https://www.youtube.com/embed/KG0VZR4pfKk",
                        "https://www.youtube.com/embed/raNV1-ySpc4",
                        "https://www.youtube.com/embed/4nKoR25rxeY",
                        "https://www.youtube.com/embed/vtwMmpn63XE",
                        "https://www.youtube.com/embed/lbUkx2hyn2o",
                        "https://www.youtube.com/embed/vWcAdaxwy3Y",
                        "https://www.youtube.com/embed/qXUpCrqsrns",
                        "https://www.youtube.com/embed/wwKDyxR1MrY",
                    ].map((videoUrl, idx) => (
                        <iframe
                            key={idx}
                            src={videoUrl}
                            className="w-full h-48"
                            allowFullScreen
                        ></iframe>
                    ))}
                </div>
            </section>

            <PiePagina />
        </div>
    );
}
