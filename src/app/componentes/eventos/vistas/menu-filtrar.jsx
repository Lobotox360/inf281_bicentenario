import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid'; // Icono de flecha hacia abajo

import { useRouter } from 'next/navigation';
import CarruselEventos from './carrusel';
import VistaCategoriaEventos from './porCategoria';
import VistaDepartamentoEventos from './porDepartamento';

const MenuFiltrar = () => {
  const [seleccionarDepartamento, setSeleccionarDepartamento] = useState('La Paz');
  const [userRole, setUserRole] =  useState(null);

  const [modoVisualizacion, setModoVisualizacion] = useState('carrusel') // 'carrusel' | 'departamento' | 'categoria'
  const [abrirSubmenu, setAbrirSubmenu] = useState(false);
  const [abrirSubmenuDepartamento, setAbrirSubmenuDepartamento] = useState(false);
  const [abrirSubmenuCategoria, setAbrirSubmenuCategoria] = useState(false);
  const [abrirSubmenuCarrusel, setAbrirSubmenuCarrusel] = useState(false);
  const router = useRouter();

  {/*SUBMENU CATEGORIA */}
  const [categorias, setCategorias] = useState([]);
  const [seleccionarCategoria, setSeleccionarCategoria] = useState(null);

  //Obtener Rol
  useEffect(() => {
    const role = localStorage.getItem('rol');
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
    try {
      const respuesta = await fetch('https://inf281-production.up.railway.app/evento/categoria');
      const datos = await respuesta.json();
      setCategorias(datos);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };
  fetchCategorias();
  }, []);

  const handleAgregarEvento = () => {
    router.push("/eventos/agregar");
  };

  /*const handleAsistir = async (eventoId) => {
    try {
      const res = await fetch('/api/asistencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventoId }),
      })
  
      if (!res.ok) throw new Error('Error al registrar asistencia')
  
      alert('✅ ¡Te has registrado como asistente!')
    } catch (error) {
      console.error(error)
      alert('❌ Ocurrió un error al registrar la asistencia.')
    }

    
  }*/
  const menuFiltrar = (menu) => {
    if (menu === 'filtrar') {
      setAbrirSubmenu(!abrirSubmenu);
      setAbrirSubmenuDepartamento(false); // Cierra submenú de departamentos
      setAbrirSubmenuCategoria(false); // Cierra submenú de categorías
      setAbrirSubmenuCarrusel(false);
    } else if (menu === 'departamento') {
      setAbrirSubmenuDepartamento(!abrirSubmenuDepartamento);
    } else if (menu === 'categoria') {
      setAbrirSubmenuCategoria(!abrirSubmenuCategoria);
    } else if (menu == 'carrusel'){
      setAbrirSubmenuCarrusel(!abrirSubmenuCarrusel);
    };
  }

  return (
      <div className="relative p-4 mt-24">
        <div className="flex justify-left mb-4 space-x-4 "> 
              {/* Ítem: filtrar */}
              <div className="cursor-pointer border bg-opacity-50 text-white p-2 px-5 rounded-md">
                <div
                  className="flex items-center justify-between"
                  onClick={() => menuFiltrar('filtrar')}
                >
                  <span>Filtrar por</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-200 ${abrirSubmenu ? 'rotate-180' : ''}`}
                  />
                </div>
                           
                {/* Submenú de filtrar */}
                {abrirSubmenu && (
                  <div className="absolute mt-2 p-4 bg-white text-black shadow-lg rounded-md z-10">
                    {/* Submenú: Carrusel */}
                    <div
                      className="flex mb-2 items-center justify-between cursor-pointer hover:bg-gray-100"
                      onClick={() => menuFiltrar('carrusel')}
                    >
                      <span>Carrusel</span>
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-200 ${abrirSubmenuCarrusel ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {/* Submenú de Departamento */}
                    {abrirSubmenuCarrusel && (
                      <div className="pl-6">
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('La Paz'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">La Paz</div>
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('Oruro'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Oruro</div>
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('Potosi'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Potosi</div>
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('Santa Cruz'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Santa Cruz</div>
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('Beni'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Beni</div>
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('Pando'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Pando</div>
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('Tarija'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Tarija</div>
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('Cochabamba'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Cochabamba</div>
                        <div onClick={() => {setModoVisualizacion('carrusel'), setSeleccionarDepartamento('Chuquisaca')}} className="cursor-pointer hover:bg-gray-100 p-2">Chuquisaca</div>
                      </div>
                    )}
                    {/* Submenú: Departamento */}
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-100"
                      onClick={() => menuFiltrar('departamento')}
                    >
                      <span>Departamento</span>
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-200 ${abrirSubmenuDepartamento ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {/* Submenú de Departamento */}
                    {abrirSubmenuDepartamento && (
                      <div className="pl-6">
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('La Paz'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">La Paz</div>
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('Oruro'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Oruro</div>
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('Potosi'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Potosi</div>
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('Santa Cruz'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Santa Cruz</div>
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('Beni'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Beni</div>
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('Pando'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Pando</div>
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('Tarija'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Tarija</div>
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('Cochabamba'), setAbrirSubmenu(false)}} className="cursor-pointer hover:bg-gray-100 p-2">Chochabamba</div>
                        <div onClick={() => {setModoVisualizacion('departamento'), setSeleccionarDepartamento('Chuquisaca')}} className="cursor-pointer hover:bg-gray-100 p-2">Chuquisaca</div>
                      </div>
                    )}
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-100 mt-2"
                      onClick={() => menuFiltrar('categoria')}
                    >
                      <span>Categoría</span>
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-200 ${abrirSubmenuCategoria ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {/* Submenú de Categoría */}
                    {abrirSubmenuCategoria && (
                      <div className="pl-6">
                          {categorias.map((categoria) => (
                          <div onClick={() => {setModoVisualizacion('categoria'); setSeleccionarCategoria(categoria.nombre); setAbrirSubmenu(false);}} key={categoria.id_categoria} className="cursor-pointer hover:bg-gray-100 p-2"> 
                            {categoria.nombre}
                          </div>
                          ))}
                      </div>
                    )}
                    

                    
                  </div>
                )}

            </div>        
        </div>
        {/* Carrusel de eventos */}
            {modoVisualizacion === 'carrusel' && (
              <div>
                  <CarruselEventos departamento={seleccionarDepartamento}/>
              </div>
        )}

        {modoVisualizacion === 'departamento' && (
          <div>
             <VistaDepartamentoEventos departamento={seleccionarDepartamento} />
          </div>
        )}

        {modoVisualizacion === 'categoria' && (
          <div>
              <VistaCategoriaEventos Auxcategoria={seleccionarCategoria}/>
          </div>
        )}

        {(userRole === 'Administrador' || userRole === 'administrador_eventos') && (
            <div className='flex justify-center items-center p-2'>
                <button onClick={handleAgregarEvento} className="cursor-pointer bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400">
                    AGREGAR EVENTO
                </button>
            </div>
        )}
    </div>
  );
};

export default MenuFiltrar;
