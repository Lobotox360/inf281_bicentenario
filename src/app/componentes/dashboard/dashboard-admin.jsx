// /pages/index.js

import Navbar from './navbar-admin';
import Sidebar from './sidebar-admin';
import Card from './card-admin';
import Chart from './chart-admin';
import PiePagina from '../inicio/footer'
import PercentageCircle from './torta';
import Chart2 from './chart2-admin';

export default function Dashboard() {
  return (
    <div>
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <Navbar />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card title="Personas agendadas" value="$628" />
                    <Card title="Comentarios publicados" value="2434" />
                    <Card title="Puntuaciones" value="1259" />
                    <Card title="Mas eventos" value="8.5" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="p-6 bg-gradient-to-r from-green-400 to-green-500 rounded-xl">
                        <Chart />
                    </div>
                    <div className="p-6 bg-gradient-to-r from-green-400 to-green-500 rounded-xl">
                        <Chart2 />
                    </div>
                </div>

                {/* Grid para 5 o más gráficos de torta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
                    <PercentageCircle percentage={45} />
                    <PercentageCircle percentage={55} />
                    <PercentageCircle percentage={60} />
                    <PercentageCircle percentage={70} />
                    <PercentageCircle percentage={80} />
                    {/* Agrega más gráficos de torta si es necesario */}
                </div>
            </div>
        </div>    
        <PiePagina />
    </div>
  );
}
