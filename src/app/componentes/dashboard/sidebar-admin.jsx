import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaFolder, FaBookOpen, FaAngleDoubleLeft, FaAngleDoubleRight, FaScroll, FaCalendarAlt, FaRobot, FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [abrir, setAbrir] = useState(true);
  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("Bievenido");
  const [emailUsuario, setEmailUsuario] = useState("");
  const router = useRouter(); // Usamos useRouter para redirigir al usuario

  const desplegarSidebar = () => {
    setAbrir(!abrir);
  };

  // Llamada a la API para cargar los datos del usuario
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const id = localStorage.getItem("id_user");

        // Validar antes de llamar a la API
        if (!token || !id) return;

        // Llamada a la API del usuario
        const response = await fetch(`https://inf281-production.up.railway.app/usuario/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) throw new Error("No se pudo obtener los datos del usuario");

        const data = await response.json();

        // Actualizar el estado con los datos del usuario
        if (data.foto) {
          setFotoUsuario(data.foto);
        }

        if (data.nombre) {
          setNombreUsuario(`Bievenido ${data.nombre}`);
        }
        if (data.email){
          setEmailUsuario(data.email);
        }

      } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
      } 
    };

    cargarDatosUsuario();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Función para cerrar sesión
  const cerrarSesion = () => {
    // Borrar los datos del localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_user");

    // Redirigir al usuario a la página de inicio (o al login)
    router.push("/login"); // Cambia "/login" por la ruta de tu página de inicio o login
  };

  return (
    <div className={`fixed sm:relative bg-gradient-to-b from-blue-900 to-blue-700 text-white min-h-screen transition-all duration-300 ${abrir ? 'w-64' : 'w-0'} overflow-hidden z-50`}>
      
      <button
        onClick={desplegarSidebar}
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
              <FaUserCircle /> 
              <button onClick={cerrarSesion} className="cursor-pointer text-white hover:text-yellow-500">Cerrar Sesión</button>
            </li>
          </div>

          {/* Menú */}
          <ul className="space-y-6 w-full px-4">
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaHome /> <Link href="/">Inicio</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaBookOpen /> <Link href="/eventos-admin">Administrar Eventos</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaScroll /> <Link href="/roles">Administrar Roles</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaFolder /> <Link href="/eventos">Eventos</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaCalendarAlt /> <Link href="/calendario">Calendario General</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaRobot /> <Link href="/agente">Agente</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
