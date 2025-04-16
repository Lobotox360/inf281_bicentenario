'use client';
//Set-ExecutionPolicy Unrestricted -Scope Process
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";
import NoticiasSlider from '../inicio/carrusel';
import Navbar from "./navbar";

export default function Inicio() {
    return (
        <div className="text-white">
            {/* Navbar */}
            <Navbar />

            {/* FRASE  */}
            <section className="text-center py-40 bg-cover bg-center">
                <h1 className="text-5xl font-extrabold">SOÑAMOS, LUCHAMOS Y VENCEMOS</h1>
            </section>

            {/* Sección de noticias */}
            <NoticiasSlider />

            {/* Sección multimedia */}
            <section className="p-10 text-center">
                <h2 className="text-3xl font-bold">Contenido Multimedia</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                    {Array(8).fill(null).map((_, idx) => (
                        <iframe
                            key={idx}
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            className="w-full h-48"
                            allowFullScreen
                        ></iframe>
                    ))}
                </div>
            </section>

            {/* Pie de página */}
            <footer className="bg-green-700 p-6 text-center">
                <p>&copy; 2025 Bicentenario de Bolivia</p>
                <div className="flex justify-center space-x-4 mt-2">
                    <FaFacebook className="text-2xl cursor-pointer hover:text-blue-500" />
                    <FaYoutube className="text-2xl cursor-pointer hover:text-red-500" />
                    <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
                    <FaTwitter className="text-2xl cursor-pointer hover:text-blue-400" />
                </div>
            </footer>
        </div>
    );
}