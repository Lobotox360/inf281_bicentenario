'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdministracionRoles = () => {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [mensaje, setMensaje] = useState(''); // Mensaje de éxito o error

    // Función para manejar el clic en el botón de retroceder
    const handleBack = () => {
        router.back();
    };

    // Función para obtener los datos de los usuarios
    const fetchUsuarios = async () => {
        try {
            const res = await fetch('https://inf281-production.up.railway.app/rol/usuarios'); // Ruta de la API
            const datos = await res.json();
            setUsuarios(datos); // Establece los datos en el estado
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
    };

    // Función para obtener los roles
    const fetchRoles = async () => {
        try {
            const respuesta = await fetch('https://inf281-production.up.railway.app/rol/roles'); // Ruta de la API
            const datos = await respuesta.json();
            setRoles(datos); // Establece los roles en el estado
        } catch (error) {
            console.error('Error al cargar los roles:', error);
        }
    };

    // Llamar a la función fetchUsuarios y fetchRoles cuando el componente se monta
    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    // Función para manejar la edición del rol
    const handleEditRole = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setRolSeleccionado(usuario.Roles.id_rol); // Establecer el rol actual del usuario
        setModalAbierto(true); // Abrir el modal
    };

    // Función para manejar el cambio de rol
    const handleRoleChange = (event) => {
        setRolSeleccionado(event.target.value);
    };

    // Función para manejar el cierre del modal
    const closeModal = () => {
        setModalAbierto(false);
        setRolSeleccionado(null);
        setMensaje('');
    };

    // Función para manejar la actualización del rol
    const handleSaveRole = async () => {
        if (rolSeleccionado && usuarioSeleccionado) {
            // Si el rol seleccionado es el mismo, no hacer nada
            if (rolSeleccionado === usuarioSeleccionado.Roles.id_rol) {
                setMensaje('El rol seleccionado es el mismo. No se realizarán cambios.');
                return;
            }

            try {
                // Enviar solicitud PUT para cambiar el rol
                const response = await fetch('https://inf281-production.up.railway.app/rol/cambiar-rol', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: usuarioSeleccionado.email,
                        nuevoRol: parseInt(rolSeleccionado)
                    }),
                });
                const data = await response.json();
                if (data.message) {
                    alert(data.message); // Mostrar mensaje de éxito
                    setModalAbierto(false); // Cerrar el modal
                    fetchUsuarios(); // Actualizar la lista de usuarios
                } else {
                    alert('Error al actualizar el rol');
                }
            } catch (error) {
                console.error('Error al actualizar el rol:', error);
                alert('Error al actualizar el rol');
            }
        }
    };

    return (
        <div className="p-4 mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Administración de Roles</h2>
            
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Teléfono</th>
                        <th className="border px-4 py-2">País</th>
                        <th className="border px-4 py-2">Rol</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{usuario.nombre}</td>
                            <td className="border px-4 py-2">{usuario.email}</td>
                            <td className="border px-4 py-2">{usuario.telefono}</td>
                            <td className="border px-4 py-2">{usuario.pais}</td>
                            <td className="border px-4 py-2">{usuario.Roles.nombre}</td>
                            <td className="border px-4 py-2">
                                <button 
                                    onClick={() => handleEditRole(usuario)} 
                                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                                >
                                    Editar Rol
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button 
                onClick={handleBack} 
                className="bg-red-500 text-white p-2 rounded mb-4 mt-4 cursor-pointer"
            >
                Volver
            </button>

            {/* Modal */}
            {modalAbierto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md w-1/3">
                        <h3 className="text-center text-xl font-semibold mb-4">Editar rol de {usuarioSeleccionado?.nombre}</h3>
                        <h3 className="text-xl font-semibold mb-4">Rol actual: {usuarioSeleccionado?.Roles.nombre}</h3>
                        <div>
                            <label htmlFor="roles" className="block text-sm font-medium text-gray-700">Seleccionar Rol:</label>
                            <select
                                id="roles"
                                name="roles"
                                value={rolSeleccionado || ''}
                                onChange={handleRoleChange}
                                className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map(role => (
                                    <option key={role.id_rol} value={role.id_rol}>
                                        {role.nombre} - {role.descripcion_rol}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {mensaje && <p className="mt-4 text-red-500">{mensaje}</p>} {/* Mostrar mensaje */}

                        <div className="mt-4 flex justify-between">
                            <button 
                                onClick={closeModal}
                                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-300"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSaveRole}
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
