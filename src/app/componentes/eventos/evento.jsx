'use client';
import React, {useEffect, useState } from 'react';
import Navbar from '../inicio/navbar';
import MenuFiltrar from './vistas/menu-filtrar';
import PiePagina from '../inicio/footer';

export default function Eventos() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <MenuFiltrar />
      <PiePagina/>
    </div>
  );
}
