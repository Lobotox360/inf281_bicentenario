'use client';
import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useForm } from "react-hook-form";

const EditarPerfil = () => {
    const [idPais, setIdPais] = useState(null);
    const [idEstado, setIdEstado] = useState(null);
    const [visible, setVisible] = useState(false);
    const [revisible, setRevisible] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    
    const { register, handleSubmit, setValue } = useForm();

    // Obtener datos del usuario desde la API
    useEffect(() => {
        const fetchUserData = async () => {
            setUserId(localStorage.getItem("id_user"));
            setToken(localStorage.getItem("access_token"));

            if (!userId || !token) {
                console.error("No hay usuario logueado.");
                return;
            }

            try {
                const response = await fetch(`https://inf281-production.up.railway.app/usuario/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Error al obtener los datos del usuario.");

                const userData = await response.json();
                setUsuario(userData);

                // Rellenar los valores en el formulario
                setValue("nombre", userData.nombre);
                setValue("apellidoPaterno", userData.apellidoPaterno);
                setValue("apellidoMaterno", userData.apellidoMaterno);
                setValue("genero", userData.genero);
                setValue("telefono", userData.telefono);
                setValue("email", userData.email);
                setValue("pais", userData.pais);
                setValue("ciudad", userData.ciudad);

                // Actualizar los estados del país y ciudad
                setIdPais(userData.pais);
                setIdEstado(userData.ciudad);
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
            }
        };

        fetchUserData();
    }, [setValue]);

    // Función para actualizar los datos del usuario
    const onSubmit = async (data) => {
        setUserId(localStorage.getItem("id_user"));
        setToken(localStorage.getItem("access_token"));

        try {
            const response = await fetch(`https://inf281-production.up.railway.app/usuario/${userId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Error al actualizar los datos.");
            
            alert("✅ Perfil actualizado con éxito.");
        } catch (error) {
            console.error("Error en la actualización del perfil:", error);
            alert("❌ No se pudo actualizar el perfil.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-800 via-yellow-600 to-green-800 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <div className="grid grid-cols-3 gap-6">
                    {/* Caja izquierda - Foto de perfil */}
                    <div className="flex flex-col items-center justify-start">
                        <h2 className="text-xl font-semibold text-center mb-4">FOTO DE PERFIL</h2>
                        <img
                            src={usuario?.foto || '../assets/ads.jpg'} // Imagen de perfil, si no hay, se usa una imagen por defecto
                            alt="Foto de perfil"
                            className="w-65 h-65 rounded-full object-cover mb-4"
                        />
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-yellow-400">
                            Cambiar Foto
                        </button>
                    </div>

                    {/* Caja derecha - Formulario */}
                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold text-center mb-4">MIS DATOS PERSONALES</h2>
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block font-medium">Nombres</label>
                                <input className="w-full p-2 border rounded-md" type="text" {...register('nombre')} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">Apellido Paterno</label>
                                    <input className="w-full p-2 border rounded-md" type="text" {...register('apellidoPaterno')} />
                                </div>
                                <div>
                                    <label className="block font-medium">Apellido Materno</label>
                                    <input className="w-full p-2 border rounded-md" type="text" {...register('apellidoMaterno')} />
                                </div>
                            </div>

                            {/* Correo electrónico y teléfono */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">Correo electrónico</label>
                                    <input className="w-full p-2 border rounded-md" type="email" {...register('email')} readOnly />
                                </div>
                                <div>
                                    <label className="block font-medium">Teléfono/Celular</label>
                                    <input className="w-full p-2 border rounded-md" type="text" {...register('telefono')} />
                                </div>
                            </div>

                            {/* País y ciudad */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">País</label>
                                    <CountrySelect countryid={idPais} onChange={(e) => setIdPais(e.id)} />
                                </div>
                                <div>
                                    <label className="block font-medium">Ciudad</label>
                                    <StateSelect countryid={idPais} stateid={idEstado} onChange={(e) => setIdEstado(e.id)} />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">Contraseña</label>
                                    <div className="relative">
                                        <input className="w-full p-2 border rounded-md pr-10" 
                                            type={visible ? "text" : "password"} 
                                            placeholder="Nueva contraseña"
                                            {...register('contrasena')}
                                        />
                                        <button className="absolute right-3 top-3 text-gray-500" type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                                            {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-medium">Repite Contraseña</label>
                                    <div className="relative">
                                        <input className="w-full p-2 border rounded-md pr-10" 
                                            type={revisible ? "text" : "password"} 
                                            placeholder="Repite tu contraseña"
                                            {...register('recontrasenia')}
                                        />
                                        <button className="absolute right-3 top-3 text-gray-500" type="button" onClick={() => setRevisible(!revisible)} aria-label={revisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                                            {revisible ? <AiFillEye /> : <AiFillEyeInvisible />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                    
                        </form>
                    </div>
                    
                </div>
                    {/* Botones */}
                    <div className="flex justify-between space-x-4 mt-6">
                        <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
                            Salir sin guardar
                        </button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
                            Guardar cambios
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default EditarPerfil;
