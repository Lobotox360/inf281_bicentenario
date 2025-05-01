// /components/Sidebar.js

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaFolder, FaEnvelope, FaBell, FaMapMarkerAlt, FaChartPie, FaAngleDoubleLeft, FaAngleDoubleRight, FaUserCircle, FaBookOpen, FaScroll, FaCalendar, FaCalendarAlt, FaUserAlt, FaRobot, FaLevelDownAlt } from 'react-icons/fa';

export default function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className={`fixed sm:relative bg-gradient-to-b from-blue-900 to-blue-700 text-white min-h-screen transition-all duration-300 ${isSidebarVisible ? 'w-64' : 'w-0'} overflow-hidden`}>
      
      <button
        onClick={toggleSidebar}
        className={`cursor-pointer text-3xl fixed top-10 right-4 p-2 bg-black rounded-lg text-white z-10 transition-all duration-300 ${isSidebarVisible ? 'ml-45' : 'ml-0'}`}
      >
        {isSidebarVisible ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
      </button>

      {isSidebarVisible && (
        <div className="flex flex-col items-center p-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-4 border-4 border-white">
            <img src="/assets/simon.jpg" alt="User Avatar" className="w-full h-full object-cover" />
          </div>


          {/* Nombre y correo */}
          <div className="text-center mb-10">
            <h2 className="text-xl font-semibold">Fabian Lobo</h2>
            <p className="text-sm text-gray-300">lobofabianultimate@gmail.com</p>
            <li className="p-2 mx-4 flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaUserCircle /> <Link href="/graph">Cerrar Sesion</Link>
            </li>
          </div>

          {/* Menú */}
          <ul className="space-y-6 w-full px-4">
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaHome /> <Link href="/">Inicio</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaBookOpen /> <Link href="/file">Administrar Eventos</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaScroll /> <Link href="/messages">Administrar Roles</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaFolder /> <Link href="/location">Eventos</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaCalendarAlt /> <Link href="/notifications">Calendario General</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-500 transition-colors duration-300">
              <FaRobot /> <Link href="/notifications">Agente</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
