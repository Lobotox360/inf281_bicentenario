"use client";
import React, { useState } from 'react';

export default function FormularioAgregarPresidente({ agregarPresidente }) {
  const [datos, setDatos] = useState({
    nombre: "",
    periodo: "",
    biografia: "",
    economia: "",
    salud: "",
    educacion: "",
    seguridad: "",
    politicasClave: ""
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple
    if (!datos.nombre || !datos.periodo) {
      alert("Completa al menos el nombre y periodo del presidente.");
      return;
    }

    const nuevoPresidente = {
      id: Date.now(),
      nombre: datos.nombre,
      periodo: datos.periodo,
      biografia: datos.biografia,
      indicadores: {
        economia: Number(datos.economia),
        salud: Number(datos.salud),
        educacion: Number(datos.educacion),
        seguridad: Number(datos.seguridad)
      },
      politicasClave: datos.politicasClave.split(",").map(p => p.trim())
    };

    agregarPresidente(nuevoPresidente);

    setDatos({
      nombre: "",
      periodo: "",
      biografia: "",
      economia: "",
      salud: "",
      educacion: "",
      seguridad: "",
      politicasClave: ""
    });

    alert("¡Nuevo presidente agregado con éxito!");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md max-w-xl mx-auto">
      <h2 className="text-center text-2xl font-bold mb-4">Agregar Nuevo Presidente</h2>

      <input
        name="nombre"
        value={datos.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        className="border rounded-md w-full p-2 mb-2"
        required
      />

      <input
        name="periodo"
        value={datos.periodo}
        onChange={handleChange}
        placeholder="Periodo (ej. 2020-2024)"
        className="border rounded-md w-full p-2 mb-2"
        required
      />

      <textarea
        name="biografia"
        value={datos.biografia}
        onChange={handleChange}
        placeholder="Biografía"
        className="border rounded-md w-full p-2 mb-2"
        rows={3}
      />

      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="number"
          name="economia"
          value={datos.economia}
          onChange={handleChange}
          placeholder="Economía (1-10)"
          className="border rounded-md p-2"
          min={1} max={10}
        />
        <input
          type="number"
          name="salud"
          value={datos.salud}
          onChange={handleChange}
          placeholder="Salud (1-10)"
          className="border rounded-md p-2"
          min={1} max={10}
        />
        <input
          type="number"
          name="educacion"
          value={datos.educacion}
          onChange={handleChange}
          placeholder="Educación (1-10)"
          className="border rounded-md p-2"
          min={1} max={10}
        />
        <input
          type="number"
          name="seguridad"
          value={datos.seguridad}
          onChange={handleChange}
          placeholder="Seguridad (1-10)"
          className="border rounded-md p-2"
          min={1} max={10}
        />
      </div>

      <input
        name="politicasClave"
        value={datos.politicasClave}
        onChange={handleChange}
        placeholder="Políticas clave (separadas por comas)"
        className="border rounded-md w-full p-2 mb-4"
      />

      <button type="submit" className="bg-blue-600 text-white w-full rounded-md py-2 hover:bg-blue-700">
        Agregar Presidente
      </button>
    </form>
  );
}
