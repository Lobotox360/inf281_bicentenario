'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const EditarCategoriasEvento = ({ eventoId }) => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [addedCategorias, setAddedCategorias] = useState([]);
  const [informacion, setInformacion] = useState({
    nombre: '',
    descripcion: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: '',
    descripcion: '',
  });

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
      toast.error('Error al obtener las categorías');  
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
    const fetchEventoData = async () => {
      try {
        const response = await fetch(`https://inf281-production.up.railway.app/evento/categoria/evento/${eventoId}`);
        const data = await response.json();
        if (data) {
          setInformacion({
            nombre: data.nombre || '',
            descripcion: data.descripcion || '',
          });
          setAddedCategorias(data);
        } else {
          toast.error('No se encontraron datos del evento'); 
        }
      } catch (error) {
        toast.error('Error al obtener los datos del evento'); 
        console.error('Error fetching event data:', error);
      }
    };

    if (eventoId) {
      fetchEventoData();
    }
  }, [eventoId]);

  const handleAgregarCategoria = () => {
    if (!selectedCategoria) {
      toast.error('Por favor selecciona una categoría');  
      return;
    }

    const categoriaSeleccionada = categorias.find(
      (categoria) => categoria.id_categoria === selectedCategoria.value
    );

    if (categoriaSeleccionada && !addedCategorias.some(c => c.id_categoria === categoriaSeleccionada.id_categoria)) {
      setAddedCategorias(prev => [...prev, categoriaSeleccionada]);
      setSelectedCategoria('');
      toast.success('Categoría agregada exitosamente');
    } else {
      toast.error('Esta categoría ya ha sido añadida'); 
    }
  };

  const handleQuitarCategoria = (index) => {
    const nuevosCategorias = addedCategorias.filter((_, i) => i !== index);
    setAddedCategorias(nuevosCategorias);
    toast.warning('Categoría eliminada'); 
  };

  const handleNuevaCategoriaChange = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria({ ...nuevaCategoria, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoriasParaEnviar = addedCategorias.map(categoria => ({
      id_categoria: categoria.id_categoria
    }));

    try {
      const response = await fetch(`https://inf281-production.up.railway.app/evento/categoria/evento/${eventoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoriasParaEnviar),
      });

      if (response.ok) {
        toast.success('Evento actualizado exitosamente'); 
      } else {
        toast.error('Error al actualizar el evento'); 
      }
    } catch (error) {
      toast.error('Error al actualizar el evento');  
      console.error('Error:', error);
    }
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

      toast.success('Categoría agregada exitosamente!'); 
      setShowAddForm(false);
    } catch (error) {
      toast.error('Ocurrió un error al agregar la categoría.'); r
      console.error('Error al agregar categoría:', error);
    }
  };

  const handleBack = () => {
    router.back();  
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <form className="bg-white p-5 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          <h3 className="text-2xl font-semibold text-center py-4">Editar Categorías</h3>

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
                <li key={categoria.id_categoria} className="flex justify-between items-center mb-2">
                  <span>{categoria.nombre}</span>
                  <span>{categoria.descripcion}</span>
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
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-400"
            >
              Salir sin guardar
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Guardar cambios y salir
            </button>
          </div>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </>
  );
};

export default EditarCategoriasEvento;
