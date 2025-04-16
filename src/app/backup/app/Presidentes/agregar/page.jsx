'use client';
import React from 'react';
import FormularioAgregarPresidente from '../../componentes/presidentes/agregarPre';
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function PaginaAgregarPresidente() {
  const router = useRouter();

  const agregarPresidente = (nuevoPresidente) => {
    console.log('Nuevo presidente:', nuevoPresidente);
    alert("¡Presidente agregado exitosamente!");
    router.push('/Presidentes'); // Vuelve automáticamente al listado después de agregar
  };

  return (
    <><div className="container mx-auto px-4 py-12">
          <FormularioAgregarPresidente agregarPresidente={agregarPresidente} />

      </div>
      <footer className="bg-green-600 p-6 text-center text-white">
            <p>&copy; 2025 Bicentenario de Bolivia</p>
              <div className="flex justify-center space-x-4 mt-2">
                  <FaFacebook className="text-2xl cursor-pointer hover:text-blue-500" />
                  <FaYoutube className="text-2xl cursor-pointer hover:text-red-500" />
                  <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
                  <FaTwitter className="text-2xl cursor-pointer hover:text-blue-400" />
              </div>
        </footer></>
  );
}
