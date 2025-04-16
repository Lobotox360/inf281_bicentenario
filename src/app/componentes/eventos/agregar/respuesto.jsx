'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
//AIzaSyA4coShq7smfTIjc5MwT9JUTs6_uTv07lA
const PatrocinadoresEvento = ({ siguientePaso, anteriorPaso }) => {
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [selectedPatrocinador, setSelectedPatrocinador] = useState('');
  const [addedPatrocinadores, setAddedPatrocinadores] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [nuevoPatrocinador, setNuevoPatrocinador] = useState({
    razon_social: '',
    institucion: '',
  });

  const router = useRouter();

  // Cargar patrocinadores desde la API
  useEffect(() => {
    // Obtener los patrocinadores de la API
    const fetchPatrocinadores = async () => {
      try {
        const response = await fetch('https://inf281-production.up.railway.app/evento/patrocinador');
        const data = await response.json();
        setPatrocinadores(data); // Guardamos los patrocinadores en el estado
      } catch (error) {
        console.error("Error al obtener patrocinadores:", error);
      }
    };

    fetchPatrocinadores();
  }, []); // Se ejecuta una vez cuando el componente se monta

  const handleAgregarPatrocinador = () => {
    if (!selectedPatrocinador) return;

    const patrocinadorSeleccionado = patrocinadores.find(
      (patrocinador) => patrocinador.id_patrocinador === selectedPatrocinador.value
    );

    if (patrocinadorSeleccionado && !addedPatrocinadores.some(p => p.value === patrocinadorSeleccionado.value)) {
      setAddedPatrocinadores([...addedPatrocinadores, patrocinadorSeleccionado]);
      setSelectedPatrocinador(''); // Limpiar la selección
    }
  };

  const handleQuitarPatrocinador = (index) => {
    setAddedPatrocinadores(addedPatrocinadores.filter((_, i) => i !== index));
  };

  // Manejo de cambios en el formulario de nuevo patrocinador
  const handleNuevoPatrocinadorChange = (e) => {
    const { name, value } = e.target;
    setNuevoPatrocinador({ ...nuevoPatrocinador, [name]: value });
  };

  // Enviar nuevo patrocinador al backend y actualizar la lista en tiempo real
  const handleAgregarNuevoPatrocinador = async () => {
    try {
      const res = await fetch('https://inf281-production.up.railway.app/evento/patrocinador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPatrocinador),
      });

      if (!res.ok) throw new Error('Error al agregar el patrocinador');

      const nuevoPatrocinadorRespuesta = await res.json();
      setNuevoPatrocinador({
        razon_social: '',
        institucion: '',
      });

      // Recargar la lista de patrocinadores para reflejar el nuevo
      fetchPatrocinadores();

      alert('✅ Patrocinador agregado exitosamente!');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error al agregar patrocinador:', error);
      alert('❌ Ocurrió un error al agregar el patrocinador.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form className="bg-white p-5 rounded-lg shadow-lg">

        {/* Select de patrocinadores existentes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona un Patrocinador
          </label>
          <Select
            options={patrocinadores}
            value={patrocinadores.find(p => p.value === selectedPatrocinador) || null}
            onChange={(e) => setSelectedPatrocinador(e ? e : '')}
            placeholder="Busca o selecciona un patrocinador"
            isSearchable
          />
        </div>
        <div className="flex justify-center mt-4 space-x-8">
            {/* Botón para agregar patrocinador de la lista */}
            <div className="mb-4">
            <button
                type="button"
                onClick={handleAgregarPatrocinador}
                className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-blue-400"
            >
                Añadir Patrocinador
            </button>
            </div>

            {/* Formulario para agregar nuevo patrocinador */}
            <div className="mb-4">
            <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-green-400"
            >
                Crear Nuevo Patrocinador
            </button>
            </div>
        </div>
        {/* Mostrar formulario de nuevo patrocinador */}
        {showAddForm && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700">Nuevo Patrocinador</h3>
            <input
              type="text"
              name="razon_social"
              value={nuevoPatrocinador.razon_social}
              onChange={handleNuevoPatrocinadorChange}
              placeholder="Razón social"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              name="institucion"
              value={nuevoPatrocinador.institucion}
              onChange={handleNuevoPatrocinadorChange}
              placeholder="Institución"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <button
              type="button"
              onClick={handleAgregarNuevoPatrocinador}
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-400"
            >
              Guardar Nuevo Patrocinador
            </button>
          </div>
        )}

        {/* Mostrar patrocinadores añadidos */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">Patrocinadores Añadidos</h3>
          <ul>
            {addedPatrocinadores.map((patrocinador, index) => (
              <li key={patrocinador.value} className="flex justify-between items-center mb-2">
                <span>{patrocinador.label}</span>
                <button
                  type="button"
                  onClick={() => handleQuitarPatrocinador(index)}
                  className="bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-400"
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
            className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-500"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={siguientePaso}
            className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
          >
            Siguiente
          </button>
        </div>

      </form>
    </div>
  );
};

export default PatrocinadoresEvento;
/*// components/MapaEvento.js
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Usamos dynamic import para cargar el mapa solo en el cliente
const GoogleMap = dynamic(() => import('@react-google-maps/api').then((mod) => mod.GoogleMap), {
  ssr: false,  // Esto asegura que no se cargue en el servidor
});
const Marker = dynamic(() => import('@react-google-maps/api').then((mod) => mod.Marker), {
  ssr: false,  // Esto asegura que no se cargue en el servidor
});

const MapaEvento = ({ direccion }) => {
  const [coordenadas, setCoordenadas] = useState(null);
  const [carga, setCarga] = useState(false);

  useEffect(() => {
    if (direccion && window.google) {
      const geocoder = new google.maps.Geocoder();

      // Convertir la dirección en coordenadas
      geocoder.geocode({ address: direccion }, (resultados, estado) => {
        if (estado === google.maps.GeocoderStatus.OK) {
          setCoordenadas({
            lat: resultados[0].geometry.location.lat(),
            lng: resultados[0].geometry.location.lng(),
          });
          setCarga(false);
        } else {
          console.error('Error al obtener la ubicación: ', estado);
          setCarga(false);
        }
      });
    }
  }, [direccion]);

  return (
    <>
      <script
        src={https://maps.googleapis.com/maps/api/js?key=AIzaSyA4coShq7smfTIjc5MwT9JUTs6_uTv07lA&libraries=places}
        strategy="beforeInteractive"
        async
      ></script>

      {carga ? (
        <div>Cargando el mapa</div>
      ) : (
        <GoogleMap
          mapContainerClassName="w-1/2 h-[500px]" 
          center={coordenadas || { lat: -16.5000, lng: -68.1193 }}  // Coordenadas predeterminadas
          zoom={14}
        >
          {coordenadas && <Marker position={coordenadas} title={direccion} />}
        </GoogleMap>
      )}
    </>
  );
};

export default MapaEvento;*/
/*
            <div className="mb-4 ">
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">
                  Departamento
                </label>
                <select name="" id="" className='w-full p-2 border border-gray-300 rounded-md'>
                  <option value="">La Paz</option>
                  <option value="">Oruro</option>
                  <option value="">Potosi</option>
                  <option value="">Cochabamba</option>
                  <option value="">Chuquisaca</option>
                  <option value="">Tarija</option>
                  <option value="">Pando</option>
                  <option value="">Beni</option>
                  <option value="">Santa Cruz</option>
                </select>
            </div>
<div className="mb-4">
            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">
              Departamento
            </label> 
            <input
              type="text"
              id="title"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
*/

/*const FotoEvento = ({ eventoData, anteriorPaso }) => {
  const handleFinalSubmit = async () => {
    try {
      const res = await fetch('https://tu-api.com/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventoData),
      });

      if (!res.ok) throw new Error('Error al guardar el evento');

      alert('✅ Evento guardado exitosamente!');
      // Redirigir o hacer algo después de enviar
    } catch (error) {
      console.error('Error al guardar el evento:', error);
      alert('❌ Ocurrió un error al guardar el evento.');
    }
  };

  return (
    <div>
      <button onClick={handleFinalSubmit}>Finalizar</button>
      <button onClick={anteriorPaso}>Volver</button>
    </div>
  );
};
 */