'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoriasEvento = ({ siguientePaso, anteriorPaso, handleUpdateData, eventoData }) => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [addedCategorias, setAddedCategorias] = useState(eventoData.categorias || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });
  const [error, setError] = useState('');

  const router = useRouter();

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
      toast.error('Error al obtener categorías');
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleAgregarCategoria = () => {
    if (!selectedCategoria) {
      toast.warning('Selecciona una categoría primero');
      return;
    }

    const categoriaSeleccionada = categorias.find(
      (categoria) => categoria.id_categoria === selectedCategoria.value
    );

    if (categoriaSeleccionada && !addedCategorias.some(c => c.value === categoriaSeleccionada.value)) {
      const nuevosCategorias = [...addedCategorias, categoriaSeleccionada];
      setAddedCategorias(nuevosCategorias);
      handleUpdateData('categorias', nuevosCategorias);
      setSelectedCategoria('');
      toast.success('Categoría añadida');
    } else {
      toast.warning('Esta categoría ya fue añadida');
    }
  };

  const handleQuitarCategoria = (index) => {
    const nuevosCategorias = addedCategorias.filter((_, i) => i !== index);
    setAddedCategorias(nuevosCategorias);
    handleUpdateData('categorias', nuevosCategorias);
    toast.info('🗑️ Categoría eliminada');
  };

  const handleNuevaCategoriaChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria({ ...nuevaCategoria, [name]: value });
  };

  const handleAgregarNuevaCategoria = async () => {
    try {
      const res = await fetch('https://inf281-production.up.railway.app/evento/categoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCategoria),
      });

      if (!res.ok) throw new Error('Error al agregar la categoría');

      const nuevaCategoriaRespuesta = await res.json();
      setNuevaCategoria({ nombre: '', descripcion: '' });
      fetchCategorias();
      toast.success('Categoría creada exitosamente');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      toast.error('Error al crear categoría');
    }
  };

  const handleSiguientePaso = () => {
    if (addedCategorias.length === 0) {
      setError('Debes agregar al menos una categoría para continuar');
      toast.error('No se puede continuar sin categorías');
      return;
    }
    setError('');
    siguientePaso();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <form className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center py-4">Paso 4: Seleccionar categorías</h3>

          {error && <p className="text-red-500 text-center">{error}</p>}

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

          <div className="flex flex-col sm:flex-row justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-8">
            <button
              type="button"
              onClick={handleAgregarCategoria}
              className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Añadir Categoría
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
            >
              Crear Nueva Categoría
            </button>
          </div>

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
              onClick={handleSiguientePaso}
              className="cursor-pointer bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>

      <ToastContainer/>
    </>
  );
};

export default CategoriasEvento;
