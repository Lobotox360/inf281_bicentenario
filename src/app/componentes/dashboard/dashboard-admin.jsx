// /pages/index.js

import Navbar from './navbar-admin';
import Sidebar from './sidebar-admin';
import Card from './card-admin';
import GraficoBarras from './chart-admin';
import PiePagina from '../inicio/footer'
import Torta from './torta';
import GraficoLineal from './chart2-admin';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [datosGenerales, setDatosGenerales] = useState();
    const [eventos, setEventos] = useState(null);
    const [error, setError] = useState();

    useEffect(() => {
        const fetchDatos = async () => {
          try {
            // Realizar ambas solicitudes simultáneamente
            const [resGenerales, resEventos] = await Promise.all([
              fetch('https://inf281-production.up.railway.app/dashboard/general'),
              fetch('https://inf281-production.up.railway.app/dashboard/eventos')
            ]);
    
            if (!resGenerales.ok || !resEventos.ok) {
              throw new Error('Error al obtener los datos');
            }
    
            const datosGenerales = await resGenerales.json();
            const datosEventos = await resEventos.json();
    
            setDatosGenerales(datosGenerales.General);
            setEventos(datosEventos);
    
          } catch (error) {
            setError(error.message);
          }
        };
    
        fetchDatos();
    }, []);

    return (
        <div>
            {console.log(eventos)}
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6">
                    <Navbar />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card titulo="Usuarios registrados" valor={datosGenerales?.nro_usuarios_registrados || 0} />
                        <Card titulo="Cantidad de eventos" valor={datosGenerales?.nro_eventos || 0} />
                        <Card titulo="Eventos realizados" valor={datosGenerales?.nro_eventos_realizados || 0} />
                        <Card titulo="Eventos próximos" valor={eventos?.nro_eventos_proximos || 0} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <div className="p-6 bg-gradient-to-r from-green-400 to-green-500 rounded-xl">
                            <GraficoBarras />
                        </div>
                        <div className="p-6 bg-gradient-to-r from-green-400 to-green-500 rounded-xl">
                            <GraficoLineal />
                        </div>
                    </div>

                    {/* Grid para 5 o más gráficos de torta */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <Torta porcentaje={datosGenerales?.nro_usuarios_hombre > 0 ? (datosGenerales?.nro_usuarios_hombre / datosGenerales?.nro_usuarios_registrados) * 100 : 0} titulo="Porcentaje de Hombres" />
                        <Torta porcentaje={datosGenerales?.nro_usuarios_mujeres > 0 ? (datosGenerales?.nro_usuarios_mujeres / datosGenerales?.nro_usuarios_registrados) * 100 : 0} titulo="Porcentaje de Mujeres"/>
                        <Torta porcentaje={datosGenerales?.nro_usuarios_otros > 0 ? (datosGenerales?.nro_usuarios_otros / datosGenerales?.nro_usuarios_registrados) * 100 : 0} titulo="Porcentaje de Otros"/>
                        <Torta porcentaje={eventos?.nro_eventos_por_modalidad.virtual > 0 ? (eventos?.nro_eventos_por_modalidad.virtual / datosGenerales?.nro_eventos) * 100 : 0} titulo="Porcentaje de Eventos Virtuales"/>
                        <Torta porcentaje={eventos?.nro_eventos_por_modalidad.hibrida > 0 ? (eventos?.nro_eventos_por_modalidad.hibrida / datosGenerales?.nro_eventos) * 100 : 0} titulo="Porcentaje de Eventos Hibridas"/>
                        <Torta porcentaje={eventos?.nro_eventos_por_modalidad.presencial > 0 ? (eventos?.nro_eventos_por_modalidad.presencial / datosGenerales?.nro_eventos) * 100 : 0} titulo="Porcentaje de Eventos Presenciales"/>
                    </div>
                </div>
            </div>    
            <PiePagina />
        </div>
    );
}
