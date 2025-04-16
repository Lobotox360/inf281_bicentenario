'use client';
import React, { useState, useEffect } from "react";
import { FaUser, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const id = localStorage.getItem("id_user");
    
    setIsLoggedIn(!!token);
  
    if (token && id) {
      fetch(`https://inf281-production.up.railway.app/usuario/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.foto) {
            setUserPhoto(data.foto); // <-- asegúrate que sea la URL completa o complétala aquí
          }
        })
        .catch(err => {
          console.error("Error al obtener la foto del usuario:", err);
        });
    }
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_user");
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push('/login');
  };

  const handleMenuToggle = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Buscando: ${searchQuery}`);
    // Aquí agregas tu lógica de búsqueda real
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-1 shadow-lg z-50 flex items-center justify-between bg-gradient-to-b from-black to-transparent">
      <Image src="/assets/logo1.png" width={64} height={32} alt="Bicentenario de Bolivia" />

      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 text-white text-xl">
        {['Historia', 'Presidentes', 'Cultura', 'Eventos', 'Agenda'].map((menu) => (
          <div key={menu} className="relative">
            <button
              className="hover:text-yellow-400"
              onClick={() => handleMenuToggle(menu)}
            >
              {menu}
            </button>
            {activeMenu === menu && (
              <div className="absolute left-0 mt-2 text-xl w-50 bg-red-500 rounded-lg shadow-lg">
                {['Opción 1', 'Opción 2', 'Opción 3'].map((opcion, idx) => (
                  <a key={idx} href="/Presidentes" className="block px-4 py-2 text-white transition delay-100 duration-200 ease-in-out hover:-translate-y-1 hover:bg-yellow-400 rounded-md">
                    {opcion}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-4 text-white text-4xl relative">
        {/* Botón Buscador */}
        <button onClick={toggleSearch} className="hover:text-yellow-400">
          <FaSearch />
        </button>

        {/* Menú usuario */}
        {isLoggedIn ? (
          <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="hover:text-yellow-400">
            {userPhoto ? (
              <Image
                src={userPhoto}
                alt="Foto de perfil"
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-yellow-400"
              />
            ) : (
              <FaUser />
            )}
          </button>        
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-red-500 text-white rounded-md shadow-lg py-2 text-xl">
                <a href="#" className="block px-4 py-2 hover:bg-gray-700">Mi agenda</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700">Mis eventos</a>
                <Link href="/Editar" className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400">Editar perfil</Link>
                <button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-gray-700">Cerrar sesión</button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="hover:text-yellow-400"><FaUser /></Link>
        )}
      </div>

      {/* Barra desplegable del buscador */}
      <div className={`absolute top-full left-0 w-full py-2 px-4 shadow-lg transform transition-all duration-300 ease-in-out ${showSearch ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <form onSubmit={handleSearch} className="flex justify-center">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
