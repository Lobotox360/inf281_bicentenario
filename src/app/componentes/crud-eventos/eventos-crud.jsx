'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrudEventos = () => {
    const router = useRouter();
    const [eventos, setEventos] = useState([]);
    const [barraBusqueda, setBarraBusqueda] = useState('');
    const [modalidadFiltro, setModalidadFiltro] = useState('');  // Nuevo estado para modalidad
    const [estadoFiltro, setEstadoFiltro] = useState('');  // Nuevo estado para estado

    // Función para obtener los datos de los eventos
    const fetchEventos = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {throw new Error("Acceso denegado");} 
            const res = await fetch('https://inf281-production.up.railway.app/eventos',{headers: {"Authorization": `Bearer ${token}`}});
            const datos = await res.json();
            setEventos(datos);
        } catch (error) {
            toast.error('Error al cargar los eventos:', error);
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    const handleAgregarEvento = () => {
        router.push(`/eventos/agregar`);
    };

    const handleEditarEvento = (id_evento) => {
        router.push(`/eventos/editar/${id_evento}`);
    };

    const handleEliminarEvento = async (id_evento) => {
        const token = localStorage.getItem("access_token");
        const confirmarEliminar = window.confirm("¿Estás seguro de eliminar este evento?");
        if (confirmarEliminar) {
            try {
                if (!token) {throw new Error("Acceso denegado");} 
                const res = await fetch(`https://inf281-production.up.railway.app/eventos/${id_evento}`, {
                    method: 'DELETE', headers: {"Authorization": `Bearer ${token}`}
                });
                const datos = await res.json();
                toast.success(datos.mensaje);
                window.location.reload();
            } catch (error) {
                toast.error('Error al eliminar el evento:', error);
            }
        }
    };

    const handleIniciarTransmicion = async (id_evento) => {
        const token = localStorage.getItem("access_token");
        try {
            if (!token) {throw new Error("Acceso denegado");} 
            const res = await fetch(`https://inf281-production.up.railway.app/eventos/iniciar-reunion/${id_evento}`, {
                method: 'PUT', headers: {"Authorization": `Bearer ${token}`}
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.status} - ${res.statusText}`);
            }
            const datos = await res.json();
            toast.success(datos.message);
            console.log('Enlace a la reunión:', datos.link);
        } catch (error) {
            toast.error('Error al iniciar la transmisión:', error);
        }
    };

    // Aplicando filtros de búsqueda, modalidad y estado
    const eventosFiltrados = eventos.filter(evento =>
        (evento.titulo.toLowerCase().includes(barraBusqueda.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(barraBusqueda.toLowerCase()) ||
        evento.modalidad.toLowerCase().includes(barraBusqueda.toLowerCase()) ||
        evento.estado.toLowerCase().includes(barraBusqueda.toLowerCase())) &&
        (modalidadFiltro === '' || evento.modalidad === modalidadFiltro) &&
        (estadoFiltro === '' || evento.estado === estadoFiltro)
    );

    return (
        <div className="p-4 mx-auto bg-white rounded-lg shadow-lg max-w-6xl">
            <ToastContainer/>
            <h2 className="text-2xl font-semibold mb-4">Administración de Eventos</h2>

            {/* Barra de búsqueda */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                    type="text"
                    placeholder="Buscar eventos..."
                    className="px-4 py-2 border rounded-lg w-full sm:w-full"
                    value={barraBusqueda}
                    onChange={(e) => setBarraBusqueda(e.target.value)}  
                />
                <button onClick={() => handleAgregarEvento()} className="cursor-pointer px-6 py-2 bg-green-500 text-white rounded hover:bg-green-400">
                    Agregar
                </button>
            </div>

            {/* Filtros por modalidad y estado */}
            <div className="mb-4 flex gap-4 flex-col sm:flex-row">
                {/* Filtro por modalidad */}
                <select
                    className="cursor-pointer px-4 py-2 border rounded-lg"
                    value={modalidadFiltro}
                    onChange={(e) => setModalidadFiltro(e.target.value)} 
                >
                    <option value="">Seleccionar modalidad</option>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="hibrida">Hibrida</option>
                </select>

                {/* Filtro por estado */}
                <select
                    className="cursor-pointer px-4 py-2 border rounded-lg"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                >
                    <option value="">Seleccionar estado</option>
                    <option value="Próximo">Próximo</option>
                    <option value="En curso">En curso</option>
                    <option value="Finalizado">Finalizado</option>
                </select>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-80 w-80 sm:w-full">
                <table className=" border-collapse border border-gray-300">
                    <thead>
                    <tr>
                        <th className="border px-4 py-2">Título</th>
                        <th className="border px-4 py-2">Descripción</th>
                        <th className="border px-4 py-2">Fecha de creación</th>
                        <th className="border px-4 py-2">Modalidad</th>
                        <th className="border px-4 py-2">Costo</th>
                        <th className="border px-4 py-2">Estado</th>
                        <th className="border px-4 py-2">Link</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {eventosFiltrados.map((evento) => (
                        <tr key={evento.id_evento}>
                        <td className="border px-4 py-2">{evento.titulo}</td>
                        <td className="border px-4 py-2">{evento.descripcion}</td>
                        <td className="border px-4 py-2">{new Date(evento.fecha).toLocaleString()}</td>
                        <td className="border px-4 py-2">{evento.modalidad}</td>
                        <td className="border px-4 py-2">{evento.costo} Bs.</td>
                        <td className="border px-4 py-2">{evento.estado}</td>
                        <td className="border px-4 py-2">{evento.link_reunion}</td>
                        <td className="border px-4 py-2">
                        {evento.estado !== 'Finalizado' && (
                            <button
                                onClick={() => handleIniciarTransmicion(evento.id_evento)}
                                className="w-full bg-green-500 text-white px-2 py-2 mb-2 rounded cursor-pointer hover:bg-green-400"
                            >
                                Iniciar jitsi
                            </button>
                            )}

                            <button
                                onClick={() => handleEditarEvento(evento.id_evento)}
                                className="w-full bg-blue-500 text-white px-2 py-2 mb-2 rounded cursor-pointer hover:bg-blue-400"
                                >
                                Editar
                            </button>
                            <button
                                onClick={() => handleEliminarEvento(evento.id_evento)}
                                className="w-full bg-red-500 text-white px-2 py-2 rounded cursor-pointer hover:bg-red-400"
                                >
                                Eliminar
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CrudEventos;
