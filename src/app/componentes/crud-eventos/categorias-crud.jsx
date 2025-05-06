'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrudCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [barraBusqueda, setBarraBusqueda] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editandoCategoria, setEditandoCategoria] = useState(null);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [descripcionCategoria, setDescripcionCategoria] = useState('');

    const fetchCategorias = async () => {
        const token = localStorage.getItem("access_token");
        try {
            if (!token) {throw new Error("Acceso denegado");} 
            const res = await fetch('https://inf281-production.up.railway.app/evento/categoria',{headers: {"Authorization": `Bearer ${token}`}});
            const datos = await res.json();
            setCategorias(datos);
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
            toast.error('Error al cargar las categorías');
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const categoriasFiltradas = categorias.filter(categoria =>
        categoria.nombre.toLowerCase().includes(barraBusqueda.toLowerCase())
    );

    const handleCrearCategoria = async () => {
        const token = localStorage.getItem("access_token");
        if (!nombreCategoria || !descripcionCategoria) {
            toast.error('Por favor, complete todos los campos');
            return;
        }
        try {
            if (!token) {throw new Error("Acceso denegado");} 
            const res = await fetch('https://inf281-production.up.railway.app/evento/categoria', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}`},
                body: JSON.stringify({
                    nombre: nombreCategoria,
                    descripcion: descripcionCategoria
                }),
            });

            const datos = await res.json();
            toast.success(datos.mensaje || 'Categoría creada.');
            setModalVisible(false);
            fetchCategorias();
        } catch (error) {
            console.error('Error al crear la categoría:', error);
            toast.error('Error al crear la categoría');
        }
    };

    const handleEditarCategoria = async () => {
        if (!nombreCategoria || !descripcionCategoria) {
            toast.error('Por favor, complete todos los campos');
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            if (!token) {throw new Error("Acceso denegado");} 
            const res = await fetch(`https://inf281-production.up.railway.app/evento/categoria/${editandoCategoria.id_categoria}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }, headers: {"Authorization": `Bearer ${token}`},
                body: JSON.stringify({
                    nombre: nombreCategoria,
                    descripcion: descripcionCategoria,
                }),
            });

            const datos = await res.json();
            toast.success(datos.mensaje || 'Categoría editada.');
            setModalVisible(false);
            setEditandoCategoria(null);
            fetchCategorias();
        } catch (error) {
            console.error('Error al editar la categoría:', error);
            toast.error('Error al editar la categoría');
        }
    };

    const handleEliminarCategoria = async (id_categoria) => {
        const token = localStorage.getItem("access_token");
        const confirmar = window.confirm('¿Estás seguro de eliminar esta categoría?');
        if (confirmar) {
            try {
                if (!token) {throw new Error("Acceso denegado");} 
                const res = await fetch(`https://inf281-production.up.railway.app/evento/categoria/${id_categoria}`, {
                    method: 'DELETE',
                    headers: {"Authorization": `Bearer ${token}`}
                });

                const datos = await res.json();
                toast.success(datos.mensaje || 'Categoría eliminada.');
                fetchCategorias();
            } catch (error) {
                console.error('Error al eliminar la categoría:', error);
                toast.error('Error al eliminar la categoría');
            }
        }
    };

    const abrirModalCrear = () => {
        setNombreCategoria('');
        setDescripcionCategoria('');
        setEditandoCategoria(null);
        setModalVisible(true);
    };

    const abrirModalEditar = (categoria) => {
        setNombreCategoria(categoria.nombre);
        setDescripcionCategoria(categoria.descripcion || '');
        setEditandoCategoria(categoria);
        setModalVisible(true);
    };

    const handleGuardar = () => {
        if (editandoCategoria) {
            handleEditarCategoria();
        } else {
            handleCrearCategoria();
        }
    };

    return (
        <div className="p-4 mx-auto bg-white rounded-lg shadow-lg max-w-5xl">
            <ToastContainer /> {/* Toastify container */}

            <h2 className="text-2xl font-semibold mb-4">Administración de Categorías</h2>

            {/* Barra de búsqueda */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                    type="text"
                    placeholder="Buscar categorías..."
                    className="px-4 py-2 border rounded-lg w-full sm:w-1/2"
                    value={barraBusqueda}
                    onChange={(e) => setBarraBusqueda(e.target.value)}
                />
                <button
                    onClick={abrirModalCrear}
                    className="cursor-pointer px-6 py-2 bg-green-500 text-white rounded hover:bg-green-400"
                >
                    Crear Categoría
                </button>
            </div>

            {/* Tabla de categorías */}
            <div className="overflow-x-auto overflow-y-auto max-h-80 w-80 sm:w-full">
                {/* Agrega max-height si quieres limitar el tamaño vertical */}
                <table className="min-w-full max-w-full border-collapse border border-black">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">Descripción</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriasFiltradas.map((categoria) => (
                            <tr key={categoria.id_categoria}>
                                <td className="border px-4 py-2">{categoria.nombre}</td>
                                <td className="border px-4 py-2">{categoria.descripcion}</td>
                                <td className="border px-4 py-2 text-center">
                                    <div className="flex justify-center flex-wrap gap-2">
                                        <button
                                            onClick={() => abrirModalEditar(categoria)}
                                            className="cursor-pointer w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminarCategoria(categoria.id_categoria)}
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
                        <h2 className="text-xl font-semibold mb-4">{editandoCategoria ? 'Editar Categoría' : 'Crear Categoría'}</h2>

                        <input
                            type="text"
                            placeholder="Nombre"
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                            value={nombreCategoria}
                            onChange={(e) => setNombreCategoria(e.target.value)}
                        />
                        <textarea
                            placeholder="Descripción"
                            className="px-4 py-2 border rounded-lg w-full mb-4"
                            value={descripcionCategoria}
                            onChange={(e) => setDescripcionCategoria(e.target.value)}
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

export default CrudCategorias;
