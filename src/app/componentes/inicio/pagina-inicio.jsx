'use client';
//Set-ExecutionPolicy Unrestricted -Scope Process
import { useState, useEffect } from "react";
import { FaFacebook, FaYoutube, FaTiktok, FaTwitter  } from "react-icons/fa";
import AOS from 'aos';import 'aos/dist/aos.css';
import NoticiasSlider from '../inicio/carrusel';
import PiePagina from './footer';
import Navbar from "./navbar";

export default function Inicio() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        AOS.init({ duration: 1000 });
        const targetDate = new Date("2025-08-06T00:00:00");
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="text-white">
            {/* Navbar */}
            <Navbar />

            {/* FRASE  */}
            <section className="text-center mt-40 mb-10 bg-cover bg-center" data-aos="fade-up">
                <h1 className="text-5xl font-extrabold">SOÑAMOS, LUCHAMOS Y VENCEMOS</h1>
            </section>

            {/* Contador */}
            <section className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-center max-w-4xl mx-auto rounded-md " data-aos="fade-up">
                <h2 className="text-4xl font-bold mb-4">CUENTA REGRESIVA</h2>
                <div className="text-3xl">
                    <span>{timeLeft.days} días </span>
                    <span>{timeLeft.hours} horas </span>
                    <span>{timeLeft.minutes} minutos </span>
                    <span>{timeLeft.seconds} segundos</span>
                </div>
            </section>

            {/* Sección de noticias */}
            <NoticiasSlider  />

            {/* Sección multimedia */}
            <section className="p-10 text-center" data-aos="fade-up">
                <h2 className="text-3xl font-bold">Contenido Multimedia</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                    {[
                        "https://www.youtube.com/embed/KG0VZR4pfKk",
                        "https://www.youtube.com/embed/raNV1-ySpc4",
                        "https://www.youtube.com/embed/4nKoR25rxeY",
                        "https://www.youtube.com/embed/vtwMmpn63XE"
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

        <PiePagina/>
            
        </div>
    );
}