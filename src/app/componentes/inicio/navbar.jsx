'use client';
import React, { useState, useEffect } from "react";
import { FaUser, FaSearch } from 'react-icons/fa';
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
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    setUserId(localStorage.getItem("id_user"));
    setToken(localStorage.getItem("access_token"));
    
    setEstadoLogin(null);
  
    if (token && id) {
      fetch(`https://inf281-production.up.railway.app/usuario/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.foto) {
            setFotoUsuario(data.foto);
          }
        })
        .catch(err => {
          console.error("Error al obtener la foto del usuario:", err);
        });
    }
  }, []);

  const handleLogout = () => {
    setUserId(localStorage.getItem("id_user"));
    setToken(localStorage.getItem("access_token"));
    setEstadoLogin(false);
    setMenuUsuario(false);
    router.push('/login');
  };

  const desplegarMenuUsuario = (menuName) => {
    setMenuActivado(menuActivado === menuName ? null : menuName);
  };

  const desplegarBarraBusqueda = () => {
    setBarraBusqueda(!barraBusqueda);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Buscando: ${buscarConsulta}`);
    // Aquí agregas tu lógica de búsqueda real
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-3 shadow-lg z-50 flex items-center justify-between bg-gradient-to-b from-black to-transparent">
      <Image src="/assets/logo1.png" width={80} height={32} alt="Bicentenario de Bolivia" />
      
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 text-white text-lg md:text-xl">
        <Link href="/" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">INICIO</Link>
        <Link href="/eventos" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">EVENTOS</Link>
        <Link href="/micalendario" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">AGENDA</Link>
        <Link href="/agente" className="bg-yellow-500 block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-x-1 rounded-full hover:bg-red-500">AGENTE VIRTUAL</Link>
      </div>

      <div className="ml-auto flex items-center gap-4 text-white text-3xl relative">
        {/* Botón Buscador */}
        <button onClick={desplegarBarraBusqueda} aria-label="Buscar" className="hover:text-yellow-400">
          <FaSearch />
        </button>

        {/* Menú usuario */}
        {estadoLogin ? (
          <div className="relative">
            <button onClick={() => setMenuUsuario(!menuUsuario)} aria-label="Abrir menú de usuario" className="hover:text-yellow-400">
              {fotoUsuario ? (
                <Image src={fotoUsuario} alt="Foto de perfil" width={40} height={40} className="rounded-full object-cover border-2 border-yellow-400"/>
              ) : (
                <FaUser />
              )}
            </button>        
            {menuUsuario && (
              <div className="absolute right-0 mt-2 w-48 bg-red-500 text-white rounded-md shadow-lg py-2 text-xl">
                <Link href="#" className="block px-4 py-2 hover:bg-yellow-400">Mi agenda</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-yellow-400">Mis eventos</Link>
                <Link href="/login/Editar" className="block px-4 py-2 hover:bg-yellow-400">Editar perfil</Link>
                <button onClick={handleLogout} className="cursor-pointer block px-4 py-2 w-full text-left hover:bg-yellow-400">Cerrar sesión</button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="hover:text-yellow-400"><FaUser /></Link>
        )}
      </div>

      {/* Barra desplegable del buscador */}
      <div className={`absolute top-full left-0 w-full py-2 px-4 shadow-lg transform transition-all duration-300 ease-in-out ${barraBusqueda ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <form onSubmit={handleSearch} className="flex justify-center">
          <input
            type="text"
            placeholder="Buscar..."
            value={buscarConsulta}
            onChange={(e) => setBuscarConsulta(e.target.value)}
            className="border border-white rounded-md px-4 py-1 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
          />
          <button type="submit" className="ml-2 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700">
            Buscar
          </button>
        </form>
      </div>
    </nav>
  );
}
