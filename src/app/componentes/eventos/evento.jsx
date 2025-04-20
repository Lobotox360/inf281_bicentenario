'use client';
import React, {useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../inicio/navbar';
import { FaUserCircle } from 'react-icons/fa'; 
import MenuFiltrar from './vistas/menu-filtrar';

export default function Eventos() {
  const [comentarioUsuario, setComentarioUsuario] = useState('');
  const [puntuacionUsuario, setPuntuacionUsuario] = useState('');
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchComentarios = async () => {
        try {
            const response = await fetch(`https://inf281-production.up.railway.app/agenda/comentarios/1`); // Cambia "4" por el id dinámico del evento
            const data = await response.json();
            
            if (response.ok) {
                setComentarios(data); // Guarda los comentarios en el estado
            } else {
                console.error('Error al obtener los comentarios');
            }
        } catch (error) {
            console.error('Hubo un problema con la solicitud:', error);
        }
    };
    fetchComentarios();
  }, []);

  const handlePuntuacionChange = (event) => {
    setPuntuacionUsuario(event.target.value); 
  };

  const handleComentarioChange = (event) => {
    setComentarioUsuario(event.target.value);
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    
    const data = {
        id_usuario: "d0e631df-cde8-4753-b21f-2ff597efd4a6", 
        id_evento: 1, 
        comentario: comentarioUsuario,
    };    
    try {
        const response = await fetch('https://inf281-production.up.railway.app/agenda/comentario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(result.message);
            setComentarioUsuario(''); 
        } else {
            alert('Hubo un error al agregar el comentario.');
        }
    } catch (error) {
        alert('Error en la solicitud. Intenta nuevamente.');
        console.error(error);
    }
};



  return (
    <div>
      <Navbar/>
      {/* Contenedor de eventos */}

      <MenuFiltrar />
    
      {/* Formulario de comentarios */}
      <h2 className="px-4 text-2xl font-semibold mb-4 text-white text-center">COMENTARIOS</h2>
      <div className="bg-white p-5 m-4 rounded-lg shadow-lg p-4 mb-4">
        {comentarios.length > 0 ? (
            comentarios.map((com, index) => (
              <div key={index} className="border-b pb-4 mb-4 flex items-center gap-4">
                {/* Icono de perfil */}
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {com.foto_usuario ? (
                    <Image src={com.foto_usuario} alt={com.nombre_usuario} width={48} height={48} className="object-cover" />
                  ) : (
                    <FaUserCircle size={48} color="#ccc" />
                  )}
                </div>
                {/* Comentario */}
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900">{com.nombre_usuario} <span className="text-sm text-gray-500">· {com.fecha}</span></p>
                    <p className="text-gray-600">{com.comentario}</p>
                  </div>
              </div>
            ))
              ) : (
                <p className="text-center text-gray-500">No hay comentarios aún.</p>
         )}
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Deja tu comentario</h2>
        <form onSubmit={handleEnviarComentario} className="bg-white p-5 rounded-lg shadow-lg">
            <div className="mb-4">
                <textarea
                id="comment"
                value={comentarioUsuario}
                onChange={(e) => setComentarioUsuario(e.target.value)}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                ></textarea>
            </div>
            <div className='flex justify-between'>
              <select value={puntuacionUsuario} onChange={handlePuntuacionChange}>
                <option value="" disabled>Calificación</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400">
                Enviar Comentario
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}
