'use client';

import { useState } from 'react';
import Navbar from '../inicio/navbar';
import CrudEventos from './eventos-crud';
import CrudCategorias from './categorias-crud';
import CrudPatrocinadores from './patrocinadores-crud';

const EventosAdmin = () => {
    const [pestanaActiva, setPestanaActiva] = useState('eventos');

    return (
        <div className="p-4 mx-auto bg-white rounded-lg shadow-lg mb-10 mt-10">
            {/* Menú de pestañas */}
            <div className="mb-6">
                {/* Versión PC - botones */}
                <div className="hidden sm:flex space-x-4">
                    <button
                        onClick={() => setPestanaActiva('eventos')}
                        className={`cursor-pointer px-4 py-2 rounded-t-lg hover:bg-white ${pestanaActiva === 'eventos' ? 'bg-white border-t-2 border-x-2 font-bold' : 'bg-gray-200'}`}
                    >
                        Administración de Eventos
                    </button>
                    <button
                        onClick={() => setPestanaActiva('categorias')}
                        className={`cursor-pointer px-4 py-2 rounded-t-lg hover:bg-white ${pestanaActiva === 'categorias' ? 'bg-white border-t-2 border-x-2 font-bold' : 'bg-gray-200'}`}
                    >
                        Administración de Categorías
                    </button>
                    <button
                        onClick={() => setPestanaActiva('patrocinadores')}
                        className={`cursor-pointer px-4 py-2 rounded-t-lg hover:bg-white ${pestanaActiva === 'patrocinadores' ? 'bg-white border-t-2 border-x-2 font-bold' : 'bg-gray-200'}`}
                    >
                        Administración de Patrocinadores
                    </button>
                </div>

                {/* Versión Celular - menú desplegable */}
                <div className="sm:hidden">
                    <select
                        value={pestanaActiva}
                        onChange={(e) => setPestanaActiva(e.target.value)}
                        className="px-4 py-2 border rounded-lg w-full"
                    >
                        <option value="eventos">Administración de Eventos</option>
                        <option value="categorias">Administración de Categorías</option>
                        <option value="patrocinadores">Administración de Patrocinadores</option>
                    </select>
                </div>
            </div>

            {/* Contenido dinámico */}
            {pestanaActiva === 'eventos' && <CrudEventos />}
            {pestanaActiva === 'categorias' && <CrudCategorias />}
            {pestanaActiva === 'patrocinadores' && <CrudPatrocinadores />}
        </div>
    );
};

export default EventosAdmin;
