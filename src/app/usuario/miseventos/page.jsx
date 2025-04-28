import React from 'react';
import MisEventos from '../../componentes/usuario/mis-eventos';
import Navbar from '../../componentes/inicio/navbar'
import PiePagina from '../../componentes/inicio/footer';

export default function MisEventosPagina() {

  return (
    <div className='min-h-screen flex flex-col mt-35'>
      <Navbar/>
      <MisEventos />
      <PiePagina/>
    </div>
  );
};
