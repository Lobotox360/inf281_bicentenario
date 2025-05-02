'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrudPatrocinadores = () => {
    const [patrocinadores, setPatrocinadores] = useState([]);
    const [barraBusqueda, setBarraBusqueda] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editandoPatrocinador, setEditandoPatrocinador] = useState(null);
    const [razonSocial, setRazonSocial] = useState('');
    const [institucion, setInstitucion] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchPatrocinadores = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://inf281-production.up.railway.app/evento/patrocinador');
            const datos = await res.json();
            setPatrocinadores(datos);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar los patrocinadores:', error);
            setLoading(false);
            toast.error('Error al cargar los patrocinadores');
        }
    };

    useEffect(() => {
        fetchPatrocinadores();
    }, []);

    const patrocinadoresFiltrados = patrocinadores.filter(patrocinador =>
        patrocinador.razon_social.toLowerCase().includes(barraBusqueda.toLowerCase())
    );

    const handleCrearPatrocinador = async () => {
        if (!razonSocial || !institucion) {
            toast.error('Por favor, complete todos los campos');
            return;
        }
        try {
            const res = await fetch('https://inf281-production.up.railway.app/evento/patrocinador', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razon_social: razonSocial,
                    institucion: institucion
                }),
            });

            const datos = await res.json();
            toast.success(datos.mensaje || 'Patrocinador creado.');
            setModalVisible(false);
            fetchPatrocinadores();
        } catch (error) {
            console.error('Error al crear el patrocinador:', error);
            toast.error('Error al crear el patrocinador');
        }
    };

    const handleEditarPatrocinador = async () => {
        if (!razonSocial || !institucion) {
            toast.error('Por favor, complete todos los campos');
            return;
        }

        try {
            const res = await fetch(`https://inf281-production.up.railway.app/evento/patrocinador/${editandoPatrocinador.id_patrocinador}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razon_social: razonSocial,
                    institucion: institucion
                }),
            });

            const datos = await res.json();
            toast.success(datos.mensaje || 'Patrocinador editado.');
            setModalVisible(false);
            setEditandoPatrocinador(null);
            fetchPatrocinadores();
        } catch (error) {
            console.error('Error al editar el patrocinador:', error);
            toast.error('Error al editar el patrocinador');
        }
    };

    const handleEliminarPatrocinador = async (id_patrocinador) => {
        const confirmar = window.confirm('¿Estás seguro de eliminar este patrocinador?');
        if (confirmar) {
            try {
                const res = await fetch(`https://inf281-production.up.railway.app/evento/patrocinador/${id_patrocinador}`, {
                    method: 'DELETE',
                });

                const datos = await res.json();
                toast.success(datos.mensaje || 'Patrocinador eliminado.');
                fetchPatrocinadores();
            } catch (error) {
                console.error('Error al eliminar el patrocinador:', error);
                toast.error('Error al eliminar el patrocinador');
            }
        }
    };

    const abrirModalCrear = () => {
        setRazonSocial('');
        setInstitucion('');
        setEditandoPatrocinador(null);
        setModalVisible(true);
    };

    const abrirModalEditar = (patrocinador) => {
        setRazonSocial(patrocinador.razon_social);
        setInstitucion(patrocinador.institucion || '');
        setEditandoPatrocinador(patrocinador);
        setModalVisible(true);
    };

    const handleGuardar = () => {
        if (editandoPatrocinador) {
            handleEditarPatrocinador();
        } else {
            handleCrearPatrocinador();
        }
    };

    return (
        <div className="p-4 mx-auto bg-white rounded-lg shadow-lg max-w-5xl">
            <ToastContainer /> {/* Toastify container */}

            <h2 className="text-2xl font-semibold mb-4">Administración de Patrocinadores</h2>

            {/* Barra de búsqueda */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                    type="text"
                    placeholder="Buscar patrocinadores..."
                    className="px-4 py-2 border rounded-lg w-full sm:w-1/2"
                    value={barraBusqueda}
                    onChange={(e) => setBarraBusqueda(e.target.value)}
                />
                <button
                    onClick={abrirModalCrear}
                    className="cursor-pointer px-6 py-2 bg-green-500 text-white rounded hover:bg-green-400"
                >
                    Crear Patrocinador
                </button>
            </div>

            {/* Tabla de patrocinadores */}
            <div className="overflow-x-auto overflow-y-auto max-h-80 sm:w-full">
                <table className="min-w-full max-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Razón social</th>
                            <th className="border px-4 py-2">Institución</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patrocinadoresFiltrados.map((patrocinador) => (
                            <tr key={patrocinador.id_patrocinador}>
                                <td className="border px-4 py-2">{patrocinador.razon_social}</td>
                                <td className="border px-4 py-2">{patrocinador.institucion}</td>
                                <td className="border px-4 py-2 text-center">
                                    <div className="flex justify-center flex-wrap gap-2">
                                        <button
                                            onClick={() => abrirModalEditar(patrocinador)}
                                            className="cursor-pointer w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminarPatrocinador(patrocinador.id_patrocinador)}
                                            className="cursor-pointer w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 w-96">
                        <h2 className="text-xl font-semibold mb-4">{editandoPatrocinador ? 'Editar Patrocinador' : 'Crear Patrocinador'}</h2>

                        <input
                            type="text"
                            placeholder="Razón social"
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                            value={razonSocial}
                            onChange={(e) => setRazonSocial(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Institución"
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                            value={institucion}
                            onChange={(e) => setInstitucion(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setModalVisible(false)}
                                className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrudPatrocinadores;
