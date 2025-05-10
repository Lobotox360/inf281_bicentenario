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
    const [rol, setRol] = useState(null);
    const [roles, setRoles] = useState(null);
    const [error, setError] = useState();

    useEffect(() => {
        setRol(localStorage.getItem('rol'));
        const fetchDatos = async () => {
          try {
            const token = localStorage.getItem("access_token");
            if (!token) {throw new Error("Acceso denegado");}
            const [resGenerales, resEventos, resRoles] = await Promise.all([
              fetch('https://inf281-production.up.railway.app/dashboard/general', {
                headers: {"Authorization": `Bearer ${token}`}
            }),
              fetch('https://inf281-production.up.railway.app/dashboard/eventos', {
                headers: {"Authorization": `Bearer ${token}`}
            }),
              fetch('https://inf281-production.up.railway.app/dashboard/rol', {
                headers: {"Authorization": `Bearer ${token}`}
            })
            ]);
    
            if (!resGenerales.ok || !resEventos.ok || !resRoles.ok) {
              throw new Error('Error al obtener los datos');
            }
    
            const datosGenerales = await resGenerales.json();
            const datosEventos = await resEventos.json();
            const datosRoles = await resRoles.json();
            setDatosGenerales(datosGenerales.General);
            setEventos(datosEventos);
            setRoles(datosRoles);
            
    
          } catch (error) {
            setError(error.message);
          }
        };
    
        fetchDatos();
    }, []);

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6">
                    <Navbar />
                      <div className={`grid grid-cols-1 sm:grid-cols-2 ${rol === 'Administrador' ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-6 mb-6`}>
                        {(rol === 'Administrador') && (<>
                          <Card titulo="Usuarios registrados" valor={datosGenerales?.nro_usuarios_registrados || 0} />
                          <Card titulo="Nro Adm. generales" valor={roles?.usuario_casual || 0} />
                          <Card titulo="Nro Adm. de eventos" valor={roles?.administrador_eventos || 0} />
                          <Card titulo="Nro Usuarios casuales" valor={roles?.Administrador || 0} /></>
                        )}
                        <Card titulo="Cantidad de eventos" valor={datosGenerales?.nro_eventos || 0} />
                        <Card titulo="Eventos realizados" valor={datosGenerales?.nro_eventos_realizados || 0} />
                        <Card titulo="Eventos próximos" valor={eventos?.nro_eventos_proximos || 0} />
                        <Card titulo="Nro total de comentarios" valor={datosGenerales?.nro_comentarios_total || 0} />
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
                    <div className={`grid gap-6 mt-6 ${rol === 'Administrador' ? 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'}`}>
                      {(rol === 'Administrador') && (
                        <Torta var1 ={datosGenerales?.nro_usuarios_hombre} var2 ={datosGenerales?.nro_usuarios_mujeres} var3 = {datosGenerales?.nro_usuarios_otros} titulo="Genero de usuarios" tag1 = "Hombres" tag2 = "Mujeres" tag3 = "Otros" />
                      )}
                      <Torta var1 = {eventos?.nro_eventos_por_modalidad.presencial} var2={eventos?.nro_eventos_por_modalidad.virtual} var3={eventos?.nro_eventos_por_modalidad.hibrida} titulo="Modalidad de eventos" tag1 = "Presencial" tag2 = "Virtual" tag3 = "Hibrido"/>
                      <Torta var1 = {datosGenerales?.nro_eventos} var2={datosGenerales?.nro_eventos_realizados} var3={eventos?.nro_eventos_proximos} titulo="Porcentaje de eventos" tag1 = "Nro eventos" tag2 = "Realizados" tag3 = "Proximos"/>
                    </div>
                </div>
            </div>    
            <PiePagina />
        </div>
    );
}