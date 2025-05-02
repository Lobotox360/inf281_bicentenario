// /pages/index.js

import Navbar from './navbar-admin';
import Sidebar from './sidebar-admin';
import Card from './card-admin';
import GraficoBarras from './chart-admin';
import PiePagina from '../inicio/footer'
import Torta from './torta';
import GraficoLineal from './chart2-admin';

export default function Dashboard() {
  return (
    <div>
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <Navbar />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card titulo="Personas agendadas" valor="$628" />
                    <Card titulo="Comentarios publicados" valor="2434" />
                    <Card titulo="Puntuaciones" valor="1259" />
                    <Card titulo="Mas eventos" valor="8.5" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
                    <Torta porcentaje={45} />
                    <Torta porcentaje={55} />
                    <Torta porcentaje={60} />
                    <Torta porcentaje={70} />
                    <Torta porcentaje={80} />
                </div>
            </div>
        </div>    
        <PiePagina />
    </div>
  );
}
