'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const CategoriasEvento = ({ siguientePaso, anteriorPaso, handleUpdateData, eventoData }) => {
  const [categorias, setCategorias] = useState([]); // Estado para las categorías disponibles
  const [selectedCategoria, setSelectedCategoria] = useState(''); // Estado para la categoría seleccionada
  const [addedCategorias, setAddedCategorias] = useState(eventoData.categorias || []); // Estado para las categorías añadidas
  const [showAddForm, setShowAddForm] = useState(false); // Controla si se debe mostrar el formulario de nueva categoría
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: '',
    descripcion: '',
  });
  const [error, setError] = useState(''); // Estado para manejar el mensaje de error

  const router = useRouter();

  // Cargar categorías desde la API
  const fetchCategorias = async () => {
    try {
      const respuesta = await fetch('https://inf281-production.up.railway.app/evento/categoria');
      const datos = await respuesta.json();
      setCategorias(datos.map(c => ({
        value: c.id_categoria,
        label: `${c.nombre} - ${c.descripcion}`,
        ...c
      })));
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    fetchCategorias(); // Llamada inicial para cargar las categorías
  }, []);

  // Función para agregar una categoría seleccionada
  const handleAgregarCategoria = () => {
    if (!selectedCategoria) return;

    const categoriaSeleccionada = categorias.find(
      (categoria) => categoria.id_categoria === selectedCategoria.value
    );

    if (categoriaSeleccionada && !addedCategorias.some(c => c.value === categoriaSeleccionada.value)) {
      const nuevosCategorias = [...addedCategorias, categoriaSeleccionada];
      setAddedCategorias(nuevosCategorias);
      handleUpdateData('categorias', nuevosCategorias);
      setSelectedCategoria(''); // Limpiar la selección
    }
  };

  // Función para eliminar una categoría de la lista
  const handleQuitarCategoria = (index) => {
    const nuevosCategorias = addedCategorias.filter((_, i) => i !== index);
    setAddedCategorias(nuevosCategorias);
    handleUpdateData('categorias', nuevosCategorias);
  };

  // Manejo de cambios en el formulario de nueva categoría
  const handleNuevaCategoriaChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria({ ...nuevaCategoria, [name]: value });
  };

  // Enviar nueva categoría al backend
  const handleAgregarNuevaCategoria = async () => {
    try {
      const res = await fetch('https://inf281-production.up.railway.app/evento/categoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCategoria),
      });

      if (!res.ok) throw new Error('Error al agregar la categoría');

      const nuevaCategoriaRespuesta = await res.json();
      setNuevaCategoria({
        nombre: '',
        descripcion: '',
      });

      // Recargar la lista de categorías para reflejar la nueva
      fetchCategorias();

      alert('✅ Categoría agregada exitosamente!');
      setShowAddForm(false); // Cerrar formulario de nueva categoría
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      alert('❌ Ocurrió un error al agregar la categoría.');
    }
  };

  // Validación antes de avanzar al siguiente paso
  const handleSiguientePaso = () => {
    if (addedCategorias.length === 0) {
      setError('Debes agregar al menos una categoría para continuar');
      return; // No permite avanzar si no hay categorías añadidas
    }

    setError(''); // Limpiar mensaje de error si todo está bien
    siguientePaso(); // Avanzar al siguiente paso
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-center py-4">Paso 4: Seleccionar categorias</h3>

        {error && <p className="text-red-500 text-center">{error}</p>} {/* Mostrar mensaje de error */}

        {/* Select de categorías existentes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona una Categoría
          </label>
          <Select
            options={categorias}
            value={selectedCategoria}
            onChange={setSelectedCategoria}
            placeholder="Busca o selecciona una categoría"
            isSearchable
          />
        </div>

        {/* Botón para agregar categoría de la lista */}
        <div className="flex flex-col sm:flex-row justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-8">
          <button
            type="button"
            onClick={handleAgregarCategoria}
            className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Añadir Categoría
          </button>

          {/* Formulario para agregar nueva categoría */}
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
          >
            Crear Nueva Categoría
          </button>
        </div>

        {/* Mostrar formulario de nueva categoría */}
        {showAddForm && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Nueva Categoría</h3>
            <input
              type="text"
              name="nombre"
              value={nuevaCategoria.nombre}
              onChange={handleNuevaCategoriaChange}
              placeholder="Nombre de la categoría"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              name="descripcion"
              value={nuevaCategoria.descripcion}
              onChange={handleNuevaCategoriaChange}
              placeholder="Descripción"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAgregarNuevaCategoria}
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
              >
                Guardar Nueva Categoría
              </button>
            </div>
          </div>
        )}

        {/* Mostrar categorías añadidas */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Categorías Añadidas</h3>
          <ul>
            {addedCategorias.map((categoria, index) => (
              <li key={categoria.value} className="flex justify-between items-center mb-2">
                <span>{categoria.label}</span>
                <button
                  type="button"
                  onClick={() => handleQuitarCategoria(index)}
                  className="cursor-pointer bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-400"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={anteriorPaso}
            className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-500"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={handleSiguientePaso} // Validar antes de avanzar
            className="cursor-pointer bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Siguiente
          </button>
        </div>

      </form>
    </div>
  );
};

export default CategoriasEvento;
