import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import CarruselEventos from './carrusel';
import VistaCategoriaEventos from './porCategoria';
import VistaDepartamentoEventos from './porDepartamento';
import VistaPatrocinadorEventos from './porPatrocinador';

const MenuFiltrar = () => {
  const [modoVisualizacion, setModoVisualizacion] = useState('carrusel') // 'carrusel' | 'departamento' | 'categoria'
  const [abrirSubmenu, setAbrirSubmenu] = useState(false);
  const [seleccionarDepartamento, setSeleccionarDepartamento] = useState('La Paz');
  const [abrirSubmenuCarrusel, setAbrirSubmenuCarrusel] = useState(false);
  const [abrirSubmenuDepartamento, setAbrirSubmenuDepartamento] = useState(false);
  const [abrirSubmenuCategoria, setAbrirSubmenuCategoria] = useState(false);
  const [abrirSubmenuPatrocinador, setAbrirSubmenuPatrocinador] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [seleccionarCategoria, setSeleccionarCategoria] = useState(null);

  const [patrocinadores, setPatrocinadores] = useState([]);
  const [seleccionarPatrocinador, setSeleccionarPatrocinador] = useState(null);

  const [modalidad, setModalidad] = useState('');
  const [estado, setEstado] = useState('');
  const [montoMinimo, setMontoMinimo] = useState('');
  const [montoMaximo, setMontoMaximo] = useState('');


  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [categoriasRespuesta, patrocinadoresRespuesta] = await Promise.all([
          fetch('https://inf281-production.up.railway.app/evento/categoria'),
          fetch('https://inf281-production.up.railway.app/evento/patrocinador')
        ]);
  
        const datosCategorias = await categoriasRespuesta.json();
        const datosPatrocinadores = await patrocinadoresRespuesta.json();
        setCategorias(datosCategorias);
        setPatrocinadores(datosPatrocinadores);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchDatos();
  }, []);

  const menuFiltrar = (menu) => {
    if (menu === 'filtrar') {
      setAbrirSubmenu(!abrirSubmenu);
      setAbrirSubmenuDepartamento(false); 
      setAbrirSubmenuCategoria(false); 
      setAbrirSubmenuCarrusel(false);
      setAbrirSubmenuPatrocinador(false);
    } else if (menu === 'departamento') {
      setAbrirSubmenuDepartamento(!abrirSubmenuDepartamento);
    } else if (menu === 'categoria') {
      setAbrirSubmenuCategoria(!abrirSubmenuCategoria);
    } else if (menu == 'carrusel'){
      setAbrirSubmenuCarrusel(!abrirSubmenuCarrusel);
    } else if (menu == 'patrocinador'){
      setAbrirSubmenuPatrocinador(!abrirSubmenuPatrocinador);
    };
  }

  return (
      <div className="relative p-4 mt-24">
        <div className="flex sm:flex-row justify-between flex-col mb-4 space-x-4 space-y-4 "> 
              {/* Ítem: filtrar */}
              <div className="w-full sm:w-auto cursor-pointer border bg-opacity-50 text-white p-2 px-5 rounded-md">
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

                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-100 mt-2"
                      onClick={() => menuFiltrar('patrocinador')}
                    >
                      <span>Patrocinador</span>
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-200 ${abrirSubmenuPatrocinador ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {/* Submenú de Patrocinador */}
                    {abrirSubmenuPatrocinador && (
                      <div className="pl-6">
                          {patrocinadores.map((patrocinador) => (
                          <div onClick={() => {setModoVisualizacion('patrocinador'); setSeleccionarPatrocinador(patrocinador.institucion); setAbrirSubmenu(false);}} key={patrocinador.id_patrocinador} className="cursor-pointer hover:bg-gray-100 p-2"> 
                            {patrocinador.institucion}
                          </div>
                          ))}
                      </div>
                    )}         
                  </div>
                )}
            </div>
            {/* Filtros de Monto fuera del Menú */}
            <div className="text-white space-x-4 space-y-4">
              <select id="modalidad" value={modalidad} onChange={(e) => setModalidad(e.target.value)} className='w-full sm:w-auto cursor-pointer p-2 border border-white rounded-md'>
                <option value="" className='text-black'>Filtrar por Modalidad</option>
                <option value="virtual" className='text-black'>Virtual</option>
                <option value="presencial" className='text-black'>Presencial</option>
                <option value="hibrida" className='text-black'>Hibrido</option>
              </select>
              <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} className='w-full sm:w-auto cursor-pointer p-2 border border-white rounded-md'>
                <option value="" className='text-black'>Filtrar por Estado</option>
                <option value="Próximo" className='text-black'>Próximo</option>
                <option value="En curso" className='text-black'>En curso</option>
                <option value="Finalizado" className='text-black'>Finalizado</option>
              </select>
              <label>Costo mínimo:</label>
              <input
                type="number"
                value={montoMinimo}
                onChange={(e) => setMontoMinimo(e.target.value)}
                className="w-full sm:w-auto p-2 border border-white rounded-md"
                placeholder="Monto mínimo"
              />
              <label>Costo máximo:</label>
              <input
                type="number"
                value={montoMaximo}
                onChange={(e) => setMontoMaximo(e.target.value)}
                className="w-full sm:w-auto p-2 border border-white rounded-md"
                placeholder="Monto máximo"
              />
            </div>
        </div>
        
        {/* Carrusel de eventos */}
            {modoVisualizacion === 'carrusel' && (
              <div>
                  <CarruselEventos departamento={seleccionarDepartamento} modalidad={modalidad} estado={estado} montoMinimo={montoMinimo} montoMaximo={montoMaximo}/>
              </div>
        )}

        {modoVisualizacion === 'departamento' && (
          <div>
             <VistaDepartamentoEventos departamento={seleccionarDepartamento} modalidad={modalidad} estado={estado} montoMinimo={montoMinimo} montoMaximo={montoMaximo}/>
          </div>
        )}

        {modoVisualizacion === 'categoria' && (
          <div>
              <VistaCategoriaEventos Auxcategoria={seleccionarCategoria} modalidad={modalidad} estado={estado} montoMinimo={montoMinimo} montoMaximo={montoMaximo}/>
          </div>
        )}

        {modoVisualizacion === 'patrocinador' && (
          <div>
              <VistaPatrocinadorEventos patrocinador={seleccionarPatrocinador} modalidad={modalidad} estado={estado} montoMinimo={montoMinimo} montoMaximo={montoMaximo}/>
          </div>
        )}
    </div>
    );
  };
export default MenuFiltrar;
