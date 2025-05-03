'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdministracionRoles = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [barraBusqueda, setBarraBusqueda] = useState('');
    const [rolFiltro, setRolFiltro] = useState('');
    const [ciudadFiltro, setCiudadFiltro] = useState('');

    const fetchUsuarios = async () => {
        try {
            const res = await fetch('https://inf281-production.up.railway.app/rol/usuarios');
            const datos = await res.json();
            setUsuarios(datos);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
            toast.error('Error al cargar los usuarios');
        }
    };

    const fetchRoles = async () => {
        try {
            const respuesta = await fetch('https://inf281-production.up.railway.app/rol/roles');
            const datos = await respuesta.json();
            setRoles(datos);
        } catch (error) {
            console.error('Error al cargar los roles:', error);
            toast.error('Error al cargar los roles');
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    // Función para manejar la edición del rol
    const handleEditarRol = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setRolSeleccionado(usuario.Roles.id_rol);
        setModalAbierto(true);
    };

    // Función para manejar el cambio de rol
    const handleCambiarRol = (e) => {
        setRolSeleccionado(e.target.value);
    };

    // Función para manejar el cierre del modal
    const closeModal = () => {
        setModalAbierto(false);
        setRolSeleccionado(null);
    };

    // Función para manejar la actualización del rol
    const handleSubmit = async () => {
        if (rolSeleccionado && usuarioSeleccionado) {
            // Si el rol seleccionado es el mismo, no hacer nada
            if (rolSeleccionado === usuarioSeleccionado.Roles.nombre) {
                toast.info('El rol seleccionado es el mismo. No se realizarán cambios.');
                return;
            }
            const id_rol = rolSeleccionado === "usuario_casual" ? 1 : rolSeleccionado === "administrador" ? 2 :
            rolSeleccionado === "administrador_eventos" ? 3 : rolSeleccionado === "administrador_contenido" ? 4 : 0;
         try {
                // Enviar solicitud PUT para cambiar el rol
                const response = await fetch('https://inf281-production.up.railway.app/rol/cambiar-rol', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: usuarioSeleccionado.email,
                        nuevoRol: id_rol,
                    }),
                });
                const data = await response.json();
                if (data.message) {
                    toast.success('Rol actualizado correctamente');
                    setModalAbierto(false);
                    fetchUsuarios();
                } else {
                    toast.error('Error al actualizar el rol');
                }
            } catch (error) {
                console.error('Error al actualizar el rol:', error);
                toast.error('Error al actualizar el rol');
            }
        }
    };

    // Filtrar usuarios por nombre, rol y país
    const usuariosFiltrados = usuarios.filter(usuario =>
        (usuario.nombre.toLowerCase().includes(barraBusqueda.toLowerCase()) || 
        usuario.email.toLowerCase().includes(barraBusqueda.toLowerCase()) || 
        usuario.telefono.toLowerCase().includes(barraBusqueda.toLowerCase()) || 
        usuario.pais.toLowerCase().includes(barraBusqueda.toLowerCase())) &&
        (rolFiltro === '' || usuario.Roles.nombre === rolFiltro) &&
        (ciudadFiltro === '' || usuario.ciudad === ciudadFiltro)
    );

    return (
        <div className="p-4 mx-auto bg-white rounded-lg shadow-lg mt-10 mb-18">
            <ToastContainer />

            <h2 className="text-2xl font-semibold mb-4">Administración de Roles</h2>

            {/* Barra de búsqueda */}
            <div className="mb-4 shadow-lg">
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    className="px-4 py-2 border rounded-lg w-full"
                    value={barraBusqueda}
                    onChange={(e) => setBarraBusqueda(e.target.value)}
                />
            </div>

            {/* Filtros por rol y país */}
            <div className="mb-4 flex gap-4 flex-col sm:flex-row ">
                {/* Filtro por rol */}
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={rolFiltro}
                    onChange={(e) => setRolFiltro(e.target.value)}
                >
                    <option value="">Seleccionar rol</option>
                    {roles.map(role => (
                        <option key={role.id_rol} value={role.nombre}>
                            {role.nombre}
                        </option>
                    ))}
                </select>

                {/* Filtro por país */}
                <select
                    className="px-4 py-2 border rounded-lg"
                    value={ciudadFiltro}
                    onChange={(e) => setCiudadFiltro(e.target.value)} 
                >
                    <option value="">Seleccionar departamento</option>
                    {[...new Set(usuarios.map(usuario => usuario.ciudad))].map((ciudad, index) => (
                        <option key={index} value={ciudad}>{ciudad}</option>
                    ))}
                </select>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto max-h-100 w-80 sm:w-full">
                {/* Agrega max-height si quieres limitar el tamaño vertical */}
                <table className="min-w-full max-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Nombre</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Teléfono</th>
                            <th className="border px-4 py-2">Ciudad</th>
                            <th className="border px-4 py-2">Rol</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((usuario, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{usuario.nombre}</td>
                                <td className="border px-4 py-2">{usuario.email}</td>
                                <td className="border px-4 py-2">{usuario.telefono}</td>
                                <td className="border px-4 py-2">{usuario.ciudad}</td>
                                <td className="border px-4 py-2">{usuario.Roles.nombre}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleEditarRol(usuario)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
                                    >
                                        Editar Rol
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalAbierto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md w-3/4 sm:w-1/2">
                        <h3 className="text-center text-xl font-semibold mb-4">Editar rol de {usuarioSeleccionado?.nombre}</h3>
                        <p className="font-semibold mb-4">Rol actual: {usuarioSeleccionado?.Roles.nombre}</p>
                        <div>
                            <label htmlFor="roles" className="block text-sm font-medium text-gray-700">Seleccionar Rol:</label>
                            <select
                                id="roles"
                                name="roles"
                                value={rolSeleccionado || ''}
                                onChange={handleCambiarRol}
                                className="cursor-pointer mt-2 mb-3 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map(role => (
                                    <option key={role.id_rol} value={role.nombre}>
                                        {role.nombre} - {role.descripcion_rol}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center mb-4 flex gap-4 flex-col sm:flex-row">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-300"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdministracionRoles;
