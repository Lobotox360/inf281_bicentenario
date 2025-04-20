'use client';
import React, {useEffect, useState } from 'react';
import Navbar from '../inicio/navbar';
import MenuFiltrar from './vistas/menu-filtrar';

export default function Eventos() {
  return (
    <div>
      <Navbar/>
      <MenuFiltrar />
    </div>
  );
}
