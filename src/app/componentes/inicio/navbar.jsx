'use client';
import React, { useState, useEffect } from "react";
import { FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa'; // Agregamos el ícono de hamburguesa y el ícono de cerrar
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuUsuario, setMenuUsuario] = useState(false);
  const [estadoLogin, setEstadoLogin] = useState(false);
  const [menuActivado, setMenuActivado] = useState(null);
  const [barraBusqueda, setBarraBusqueda] = useState(false);
  const [buscarConsulta, setBuscarConsulta] = useState("");
  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [rol, setRol] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); 
  const router = useRouter();

  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const res = await fetch('https://inf281-production.up.railway.app/eventos'); 
        const eventosData = await res.json();
        setEventos(eventosData);
        setEventosFiltrados(eventosData);
      } catch (error) {
        console.error("❌ Error al cargar los eventos:", error);
      }
    };

    cargarEventos();
  }, []);


  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const id_usuario = localStorage.getItem("id_user");
        const token = localStorage.getItem("access_token");
        const rol = localStorage.getItem("rol");
  
        // Actualizar estados locales
        setToken(token);
        setIdUsuario(id_usuario);
        setRol(rol);
        setEstadoLogin(!!token);
  
        // Validar antes de llamar a la API
        if (!token || !id_usuario) return;
  
        // Llamada a la API del usuario
        const res = await fetch(`https://inf281-production.up.railway.app/usuario/${id_usuario}`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        });
  
        if (!res.ok) throw new Error("No se pudo obtener los datos del usuario");
  
        const datos = await res.json();
  
        if (datos.foto) {
          setFotoUsuario(datos.foto);
          console.log("📸 Foto cargada:", datos.foto);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
      }
    };
  
    cargarDatosUsuario();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIdUsuario(null);
    setToken(null);
    setRol(null);
    setEstadoLogin(false);
    setMenuUsuario(false);
    router.push('/');
  };

  const desplegarMenuUsuario = (menuName) => {
    setMenuActivado(menuActivado === menuName ? null : menuName);
  };

  const desplegarBarraBusqueda = () => {
    setBarraBusqueda(!barraBusqueda);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setBuscarConsulta(query); 

    if (!query.trim()) {
      setEventosFiltrados([]);  
      return;
    }
    const resultados = eventos.filter(evento =>
      evento.titulo.toLowerCase().includes(buscarConsulta.toLowerCase()) ||
      evento.descripcion.toLowerCase().includes(buscarConsulta.toLowerCase()) ||
      evento.CategoriasEvento.some(categoria =>
        categoria.categoria.nombre.toLowerCase().includes(buscarConsulta.toLowerCase())
      )
    );
  
    setEventosFiltrados(resultados);
  };
  
  

  // Función para manejar el toggle del menú hamburguesa
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-3 shadow-lg z-50 flex items-center justify-between bg-gradient-to-b from-black to-transparent">
      <Image src="/assets/logo1.png" width={80} height={32} alt="Bicentenario de Bolivia" />
      {/* Menú de navegación para pantallas grandes */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6 text-white text-lg md:text-xl">
        <Link href="/" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">INICIO</Link>
        <Link href="/eventos" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">EVENTOS</Link>
        <Link href="/calendario" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">AGENDA</Link>
        <Link href="/agente" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">AGENTE</Link>
        <Link href="/puntuacion" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">PODIO</Link>
      </div>

      {/* Menú desplegable en móviles */}
      <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-full bg-opacity-75 p-4 md:hidden bg-gradient-to-b from-transparent to-black transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-100%] pointer-events-none'}`}>
        <div className="flex flex-col space-y-4 text-white text-lg">
          <Link href="/" className="text-center mt-4 hover:text-yellow-400">INICIO</Link>
          <Link href="/eventos" className="text-center hover:text-yellow-400">EVENTOS</Link>
          <Link href="/calendario" className="text-center hover:text-yellow-400">AGENDA</Link>
          <Link href="/agente" className="text-center hover:text-yellow-400">AGENTE</Link>
          <Link href="/puntuacion" className="text-center hover:text-yellow-400">PODIO</Link>
        </div>
      </div>

      {/* Menú de usuario */}
      <div className="ml-auto flex items-center gap-4 text-white text-3xl relative">
        {/* Menú hamburguesa */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Botón Buscador */}
        <button onClick={desplegarBarraBusqueda} aria-label="Buscar" className="cursor-pointer hover:text-yellow-400">
          <FaSearch />
        </button>

        {/* Menú usuario */}
        {estadoLogin ? (
          <div className="relative">
            <button onClick={() => setMenuUsuario(!menuUsuario)} aria-label="Abrir menú de usuario" className="cursor-pointer mt-2 hover:text-yellow-400">
              {fotoUsuario ? (
                <img src={fotoUsuario} alt="Foto de perfil" className="w-15 h-15 rounded-full border-2 border-yellow-400" />
              ) : (
                <FaUser />
              )}
            </button>        
            <div 
              className={`absolute right-0 mt-2 w-48 bg-red-500 text-white rounded-md shadow-lg py-2 text-xl transition-all duration-300 ease-in-out ${menuUsuario ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
            >
            {["Administrador", "administrador_eventos", "administrador_contenido"].includes(rol) && (
              <Link href={`/dashboard`} className="block px-4 py-2 hover:bg-yellow-400 border-b-2 border-yellow-400">
                Dashboard
              </Link>
            )}
            <Link href={`/usuario/micalendario/${idUsuario}`} className="block px-4 py-2 hover:bg-yellow-400">Mi agenda</Link>
            <Link href="/usuario/miseventos" className="block px-4 py-2 hover:bg-yellow-400">Mis eventos</Link>
            <Link href="/login/editarPerfil" className="block px-4 py-2 hover:bg-yellow-400">Editar perfil</Link>
            <button onClick={handleLogout} className="cursor-pointer block px-4 py-2 w-full text-left border-t-2 border-yellow-400 hover:bg-yellow-400">Cerrar sesión</button>
          </div>
        </div>
        
        ) : (
          <Link href="/login" className="hover:text-yellow-400"><FaUser /></Link>
        )}
      </div>

      {/* Barra desplegable del buscador */}
      <div className={`absolute top-full left-0 w-full py-2 px-4 shadow-lg bg-gradient-to-b from-transparent to-black transform transition-all duration-300 ease-in-out ${barraBusqueda ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <form onSubmit={(e) => e.preventDefault()} className="flex justify-center">
          <input
            type="text"
            placeholder="Buscar..."
            value={buscarConsulta}
            onChange={handleSearch}
            className="border border-white rounded-md px-4 py-1 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
          />
        </form>

        {/* Lista de resultados filtrados */}
        {buscarConsulta && eventosFiltrados.length > 0 && (
          <div className="mt-2 max-h-60 overflow-y-auto text-center rounded-md">
            <ul>
              {eventosFiltrados.map((evento) => (
                <Link key={evento.id_evento} href={`/eventos/vermas/${evento.id_evento}`} passHref>
                  <li className="px-4 py-2 hover:bg-yellow-400 cursor-pointer">
                    {evento.titulo}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}

        {/* Si no hay resultados, mostrar un mensaje */}
        {buscarConsulta && eventosFiltrados.length === 0 && (
          <div className="mt-2 max-h-60 overflow-y-auto text-white text-center rounded-md">
            <p className="px-4 py-2">No se encontraron eventos con el nombre - {buscarConsulta}</p>
          </div>
        )}
      </div>

    </nav>
  );
}
