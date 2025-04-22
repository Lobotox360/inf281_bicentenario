'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../inicio/navbar';

const EventosAdmin = () => {
    const router = useRouter();
    const [eventos, setEventos] = useState([]);
    const [message, setMessage] = useState('');

    // Función para obtener los datos de los eventos
    const fetchEventos = async () => {
        try {
            const response = await fetch('https://inf281-production.up.railway.app/eventos'); // Ruta de la API
            const data = await response.json();
            setEventos(data); // Establece los datos en el estado
        } catch (error) {
            console.error('Error al cargar los eventos:', error);
        }
    };

    // Llamar a la función fetchEventos cuando el componente se monta
    useEffect(() => {
        fetchEventos();
    }, []);

    const handleAgregarEvento = () => {
        router.push(`/eventos/agregar`); // Redirigir a la ruta de edición
    };

    // Función para manejar la edición del evento
    const handleEditarEvento = (id_evento) => {
        router.push(`/eventos/editar/${id_evento}`); // Redirigir a la ruta de edición
    };

    // Función para eliminar un evento
    const handleDeleteEvent = async (id_evento) => {
        const confirmarEliminar = window.confirm("¿Estás seguro de eliminar este evento?");
        if (confirmarEliminar) {
            try {
                const res = await fetch(`https://inf281-production.up.railway.app/eventos/${id_evento}`, {
                    method: 'DELETE',
                });

                const datos = await res.json();
                if (datos.message) {
                    setMessage(datos.message); 
                    fetchEventos();
                } else {
                    setMessage('Error al eliminar el evento');
                }
            } catch (error) {
                console.error('Error al eliminar el evento:', error);
                setMessage('Error al eliminar el evento');
            }
        }
    };

    return (
        <div className="p-4 mx-auto bg-white rounded-lg shadow-lg">
            <Navbar/>
            <h2 className="text-2xl font-semibold mb-4">Administración de Eventos</h2>
            {message && <p className="text-green-500 mb-4">{message}</p>} {/* Mostrar mensaje de éxito */}

            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Título</th>
                        <th className="border px-4 py-2">Descripción</th>
                        <th className="border px-4 py-2">Fecha de creacion</th>
                        <th className="border px-4 py-2">Modalidad</th>
                        <th className="border px-4 py-2">Costo</th>
                        <th className="border px-4 py-2">Estado</th>
                        <th className="border px-4 py-2">Link</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {eventos.map((evento) => (
                        <tr key={evento.id_evento}>
                            <td className="border px-4 py-2">{evento.titulo}</td>
                            <td className="border px-4 py-2">{evento.descripcion}</td>
                            <td className="border px-4 py-2">{new Date(evento.fecha).toLocaleString()}</td>
                            <td className="border px-4 py-2">{evento.modalidad}</td>
                            <td className="border px-4 py-2">{evento.costo} Bs.</td>
                            <td className="border px-4 py-2">{evento.estado}</td>
                            <td className="border px-4 py-2">{evento.link_reunion}</td>
                            <td className="border px-4 py-2">
                                <button 
                                    onClick={() => handleEditarEvento(evento.id_evento)} 
                                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 cursor-pointer hover:bg-blue-400"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => handleDeleteEvent(evento.id_evento)} 
                                    className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-400"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => handleAgregarEvento()} className='bg-green-500 text-white px-4 py-2 mt-4 rounded mr-2 cursor-pointer hover:bg-green-400'>
                Agregar
            </button>
        </div>
    );
};

export default EventosAdmin;
