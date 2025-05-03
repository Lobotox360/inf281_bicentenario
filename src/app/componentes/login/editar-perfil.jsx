'use client';

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';  // Importar Toastify
import 'react-toastify/dist/ReactToastify.css'; // Estilos de Toastify

const EditarPerfil = () => {
    const [usuario, setUsuario] = useState(null);
    const router = useRouter();
    
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id_usuario = localStorage.getItem("id_user");
            const token = localStorage.getItem("access_token");

            if (!id_usuario || !token) {
                console.error("No hay usuario logueado.");
                return;
            }

            const fetchDatosUsuarios = async () => {
                try {
                    const res = await fetch(`https://inf281-production.up.railway.app/usuario/${id_usuario}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!res.ok) throw new Error("Error al obtener los datos del usuario.");

                    const datos = await res.json();
                    setUsuario(datos);
                    setValue("nombre", datos.nombre);
                    setValue("apellidopaterno", datos.apellidopaterno);
                    setValue("apellidomaterno", datos.apellidomaterno);
                    setValue("genero", datos.genero);
                    setValue("telefono", datos.telefono);
                    setValue("email", datos.email);
                    setValue("pais", datos.pais);
                    setValue("ciudad", datos.ciudad);

                } catch (error) {
                    console.error("Error al obtener datos del usuario:", error);
                }
            };

            fetchDatosUsuarios();
        }
    }, [setValue]);

    const cambiarFoto = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        const formData = new FormData();
        formData.append("foto", archivo);
        try {
            const id_usuario = localStorage.getItem("id_user");
            const token = localStorage.getItem("access_token");

            const res = await fetch(`https://inf281-production.up.railway.app/usuario/foto/${id_usuario}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Error al subir la foto");

            const imagen = await res.json();
            toast.success("La foto se cambio correctamente."); 
            setTimeout(() => {window.location.reload()}, 3000);
            setUsuario(prev => ({ ...prev, foto: imagen.foto })); 
        } catch (error) {
            console.error("Error al cambiar la foto:", error);
            toast.error("No se pudo cambiar la foto."); 
        }
    };

    const onSubmit = async (data) => {
        const id_usuario = localStorage.getItem("id_user");  
        const token = localStorage.getItem("access_token");
        const { nombre, apellidopaterno, apellidomaterno, telefono, pais, ciudad, genero } = data;

        const datos = {
            nombre,
            apellidopaterno,
            apellidomaterno,
            telefono,
            pais,
            ciudad,
            genero
        };

        try {
            const res = await fetch(`https://inf281-production.up.railway.app/usuario/${id_usuario}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos),
            });

            if (!res.ok) throw new Error("Error al actualizar los datos.");

            toast.success("✅ Perfil actualizado con éxito.");  
        } catch (error) {
            console.error("Error en la actualización del perfil:", error);
            toast.error("❌ No se pudo actualizar el perfil."); 
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-800 via-yellow-600 to-green-800 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Caja izquierda - Foto de perfil */}
                    <div className="flex flex-col items-center justify-start md:col-span-1">
                        <h2 className="text-xl font-semibold text-center mb-4">FOTO DE PERFIL</h2>
                        <img
                            src={usuario?.foto || '../assets/cargando.png'} 
                            alt="Foto de perfil"
                            className="w-65 h-65 rounded-full object-cover mb-4"
                        />
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={cambiarFoto}
                                id="fileInput"
                                className="hidden"
                            />
                            <label
                                htmlFor="fileInput"
                                className="bg-orange-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-yellow-400"
                            >
                                Cambiar Foto
                            </label>
                        </div>
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
                                    <input className="w-full p-2 border rounded-md" type="text" {...register('apellidopaterno')} />
                                </div>
                                <div>
                                    <label className="block font-medium">Apellido Materno</label>
                                    <input className="w-full p-2 border rounded-md" type="text" {...register('apellidomaterno')} />
                                </div>
                            </div>

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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">País</label>
                                    <input className="w-full p-2 border rounded-md" type="text" {...register('pais')} readOnly />
                                </div>
                                <div>
                                    <label className="block font-medium">Ciudad</label>
                                    <input className="w-full p-2 border rounded-md" type="text" {...register('ciudad')} readOnly />
                                </div>
                            </div>

                            <div className="flex justify-between space-x-4 mt-6">
                                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-red-600" onClick={handleBack}>
                                    Volver
                                </button>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-green-600">
                                    Guardar cambios
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditarPerfil;
