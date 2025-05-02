// /components/Navbar.js

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState("");

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const id_usuario = localStorage.getItem("id_user");

        // Validar antes de llamar a la API
        if (!token || !id_usuario) return;

        // Llamada a la API del usuario
        const response = await fetch(`https://inf281-production.up.railway.app/usuario/${id_usuario}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) throw new Error("No se pudo obtener los datos del usuario");

        const data = await response.json();
        console.log(data.id_rol);

        if (data.foto) {
          setFotoUsuario(data.foto);
        }

        if (data.nombre) {
          setNombreUsuario(`Bievenido ${data.nombre}`);
        }

        switch (data.id_rol) {
          case 1:
            setRolUsuario("Usuario casual");
            break;
          case 2:
            setRolUsuario("Administrador General del Sistema");
            break;
          case 3:
            setRolUsuario("Administrador de Eventos");
            break;
          case 4:
            setRolUsuario("Administrador de Contenidos");
            break;
          default:
            setRolUsuario("Rol desconocido");
            break;
        }
        
        
      } catch (error) {
        console.error("❌ Error al cargar datos del usuario:", error);
      }
    };

    cargarDatosUsuario();
  }, []); 

  return (
    <div className="flex justify-between items-center bg-yellow-600 p-4 text-white rounded-lg mb-6">
      <div className="flex items-center space-x-4">
        {/* Foto de usuario */}
        <img src={fotoUsuario || "/assets/cargando.png"} alt="User Avatar" className="mx-5 w-12 h-12 rounded-full" />
        <div>
          {/* Nombre del usuario */}
          <h3 className="text-lg font-semibold">{nombreUsuario}</h3>
          {/* Rol del usuario */}
          <p className="text-sm">{rolUsuario}</p>
        </div>
      </div>
    </div>
  );
}
