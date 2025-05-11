'use client';
import { useState, useEffect, useRef } from 'react';
import { FaHome, FaFolder, FaBookOpen, FaAngleDoubleLeft, FaAngleDoubleRight, FaScroll, FaCalendarAlt, FaRobot, FaUserCircle, FaDatabase } from 'react-icons/fa';
import { Html5Qrcode } from 'html5-qrcode';  // Importa la librería para QR
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [abrir, setAbrir] = useState(true);
  const [escaneando, setEscaneando] = useState(false);
  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("Bienvenido");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [rol, setRol] = useState(null); 
  const router = useRouter(); 
  const QRef = useRef(null); 

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const id_usuario = localStorage.getItem("id_user");
        setRol(localStorage.getItem('rol'));
        
        if (!token || !id_usuario) return;

        const res = await fetch(`https://inf281-production.up.railway.app/usuario/${id_usuario}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!res.ok) throw new Error("No se pudo obtener los datos del usuario");

        const data = await res.json();
        if (data.foto) setFotoUsuario(data.foto);
        if (data.nombre) setNombreUsuario(`Bienvenido ${data.nombre}`);
        if (data.email) setEmailUsuario(data.email);

      } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
      } 
    };

    cargarDatosUsuario();
  }, []); 

  const handleRegistrarQR = () => {
    setEscaneando(true); 
  };

  useEffect(() => {
    if (escaneando) {
      const scanner = new Html5Qrcode("qr-reader");

      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          alert(decodedText); 
          setEscaneando(false); 
          scanner.stop();
        },
        (error) => { console.error(error); }
      ).catch((err) => {
        console.error("Error al iniciar el escáner:", err);
        setEscaneando(false); 
      });
    }
  }, [escaneando]); 

  const esMovil = () => {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  };

  const cerrarSesion = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className={`fixed sm:relative bg-gradient-to-b from-blue-900 to-blue-700 text-white min-h-screen transition-all duration-300 ${abrir ? 'w-64' : 'w-0'} overflow-hidden z-50`}>
      <button
        onClick={() => setAbrir(!abrir)}
        className={`cursor-pointer text-3xl fixed top-10 right-4 p-2 bg-black rounded-lg text-white z-10 transition-all duration-300 ${abrir ? 'right-16' : 'right-4'}`}
      >
        {abrir ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
      </button>

      {abrir && (
        <div className="flex flex-col items-center p-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-4 border-4 border-white">
            <img src={fotoUsuario || "/assets/cargando.png"} alt="User Avatar" className="w-full h-full object-cover" />
          </div>

          {/* Nombre y correo */}
          <div className="text-center mb-10">
            <h2 className="text-xl font-semibold">{nombreUsuario}</h2>
            <p className="text-sm text-gray-300">{emailUsuario}</p>
            <li className="p-2 mx-4 flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaUserCircle /> <button onClick={cerrarSesion} className="cursor-pointer text-white hover:text-yellow-500">Cerrar Sesión</button>
            </li>
          </div>

          {/* Menú */}
          <ul className="space-y-6 w-full px-4">
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaHome /> <a href="/">Inicio</a>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaDatabase /> <a href="/dashboard">Dashboard</a>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaBookOpen /> <a href="/eventos-admin">Administrar Eventos</a>
            </li>
            {(rol === 'Administrador') && (
              <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
                <FaScroll /> <a href="/roles">Administrar Roles</a>
              </li>
            )}
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaFolder /> <a href="/eventos">Eventos</a>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaCalendarAlt /> <a href="/calendario">Calendario General</a>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaRobot /> <a href="/agente">Agente</a>
            </li>
          </ul>
        </div>
      )}

      {/* Botón para activar el escáner QR */}
        <button 
          onClick={handleRegistrarQR} 
          className="fixed cursor-pointer bottom-6 right-6 bg-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Registrar QR
        </button>

      {escaneando && (
        <div id="qr-reader" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        </div>
      )}
    </div>
  );
}
