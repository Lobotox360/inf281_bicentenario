'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../inicio/navbar';

const Podio = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [topUsuarios, setTopUsuarios] = useState([]);

  useEffect(() => {
    fetch('https://inf281-production.up.railway.app/puntuacion/top/10')
      .then(response => response.json())
      .then(data => {
        setTopUsuarios(data.slice(0, 3)); // Los primeros 3
        setUsuarios(data.slice(3)); // El resto de los usuarios
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <><Navbar /><div className="mt-20 bg-gradient-to-b from-red-500 via-yellow-500 to-green-500 min-h-screen flex flex-col items-center p-6">
          <h1 className="text-4xl font-extrabold text-white mb-6">Podio de los Mejores</h1>

          {/* Podio de los 3 primeros */}
          <div className="w-full max-w-6xl mb-10">
              <h2 className="text-3xl font-semibold text-center text-white mb-6">Top 3</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {topUsuarios.map((usuario, index) => (
                      <div key={usuario.id_usuario} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                          <h3 className="text-2xl font-semibold">{index + 1}. {usuario.nombre} {usuario.apellidopaterno}</h3>
                          <img
                              src={usuario.foto}
                              alt={`${usuario.nombre} ${usuario.apellidopaterno}`}
                              className="w-32 h-32 rounded-full border-4 border-indigo-500 mt-4" />
                          <p className="text-xl mt-4 font-bold">Puntaje: {usuario.puntaje}</p>
                      </div>
                  ))}
              </div>
          </div>

          {/* Tabla de usuarios restantes */}
          <div className="w-full max-w-6xl">
              <h2 className="text-3xl font-semibold text-center text-white mb-6">Otros Usuarios</h2>
              <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-lg">
                  <thead>
                      <tr className="bg-indigo-500 text-white">
                          <th className="py-3 px-6">Nombre</th>
                          <th className="py-3 px-6">Foto</th>
                          <th className="py-3 px-6">Puntaje</th>
                      </tr>
                  </thead>
                  <tbody>
                      {usuarios.map(usuario => (
                          <tr key={usuario.id_usuario} className="border-b hover:bg-gray-100">
                              <td className="py-3 px-6 text-center">{usuario.nombre} {usuario.apellidopaterno}</td>
                              <td className="py-3 px-6 text-center">
                                  <img src={usuario.foto} alt={`${usuario.nombre} ${usuario.apellidopaterno}`} className="w-16 h-16 rounded-full mx-auto" />
                              </td>
                              <td className="py-3 px-6 text-center">{usuario.puntaje}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div></>
  );
};

export default Podio;
