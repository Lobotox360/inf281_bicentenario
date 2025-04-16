'use client';
import React from 'react';
import ListaPresidentes from '../componentes/presidentes/presidentes';
import { FaFacebook, FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";


export default function PresidentesModule() {
  return (
    <>
      <div className="container px-4 pt-28 pb-10 space-y-12">
        <ListaPresidentes  />
      </div>

      <footer className="bg-green-600 p-6 text-center text-white">
        <p>&copy; 2025 Bicentenario de Bolivia</p>
        <div className="flex justify-center space-x-4 mt-2">
          <FaFacebook className="text-2xl cursor-pointer hover:text-blue-500" />
          <FaYoutube className="text-2xl cursor-pointer hover:text-red-500" />
          <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
          <FaTwitter className="text-2xl cursor-pointer hover:text-blue-400" />
        </div>
      </footer>
    </>
  );
}
