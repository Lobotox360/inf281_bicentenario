'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '../inicio/navbar';
import CarruselEventos from './vistas/carrusel';
import { FaUserCircle } from 'react-icons/fa'; 
import MenuFiltrar from './vistas/menu-filtrar';

export default function Eventos() {
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      name: 'Edi',
      time: 'hace 3 minutos',
      text: "Buen evento.",
      avatar: '/assets/sucre.jpg',
    },
    {
      name: 'Elmo',
      time: 'ayer',
      text: "La comida no me gusto",
      avatar: '/assets/sucre.jpg',
    },
    {
        name: 'Sucre',
        time: 'hace 1 hora',
        text: "Mucha gente",
        avatar: '/assets/sucre.jpg',
    },
      {
        name: 'Simon',
        time: 'ayer',
        text: "El mejor evento del mundo",
        avatar: '/assets/sucre.jpg',
    }
  ]);



  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (token) {
        // Si no hay token, el usuario no está logueado
        alert('Comentario enviado');
      }
    else{
        alert("Debes iniciar sesión para enviar un comentario");
    }
    return;
    // Aquí puedes agregar la lógica para enviar el comentario
  };


  return (
    <div>
      <Navbar/>
      {/* Contenedor de eventos */}

        <MenuFiltrar />
    
      {/* Formulario de comentarios */}
      <h2 className="px-4 text-2xl font-semibold mb-4 text-white text-center">COMENTARIOS</h2>
      <div className="bg-white p-5 m-4 rounded-lg shadow-lg p-4 mb-4">
        {commentsList.map((c, index) => (
          <div key={index} className="border-b pb-4 mb-4 flex items-center gap-4">
            {/* Icono de perfil */}
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {c.avatar ? (
                <Image src={c.avatar} alt={c.name} width={48} height={48} className="object-cover" />
              ) : (
                <FaUserCircle size={48} color="#ccc" />
              )}
            </div>
            {/* Comentario */}
            <div className="flex flex-col">
              <p className="font-semibold text-gray-900">{c.name} <span className="text-sm text-gray-500">· {c.time}</span></p>
              <p className="text-gray-600">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Deja tu comentario</h2>
        <form onSubmit={handleCommentSubmit} className="bg-white p-5 rounded-lg shadow-lg">
            <div className="mb-4">
                <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                ></textarea>
            </div>
            <div className='flex justify-end'>
                <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400">
                    Enviar Comentario
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
