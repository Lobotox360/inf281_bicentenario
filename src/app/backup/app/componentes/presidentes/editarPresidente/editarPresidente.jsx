'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditarPresidente() {
  const [presidente, setPresidente] = useState(null);
  const [nombre, setNombre] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState('');

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      // Simulación de datos. Reemplazá esto con tu fetch real.
      const allPresidentes = [
        { id: '1', nombre: 'Ejemplo 1', periodo: '1900-1904', descripcion: 'Descripción...', foto: '' },
        { id: '2', nombre: 'Ejemplo 2', periodo: '1910-1914', descripcion: 'Descripción...', foto: '' },
      ];
      const presidenteData = allPresidentes.find(p => p.id == id);
      if (presidenteData) {
        setPresidente(presidenteData);
        setNombre(presidenteData.nombre);
        setPeriodo(presidenteData.periodo);
        setDescripcion(presidenteData.descripcion);
        setFoto(presidenteData.foto);
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPresidente = { ...presidente, nombre, periodo, descripcion, foto };
    alert(`Datos del presidente ${nombre} actualizados`);
    router.push('/Presidentes');
  };

  if (!presidente) return <p>Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Editar Presidente</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos del formulario iguales */}
      </form>
    </div>
  );
}
