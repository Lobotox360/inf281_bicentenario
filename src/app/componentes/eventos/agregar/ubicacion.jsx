'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api';

const UbicacionEvento = ({ siguientePaso, anteriorPaso, handleUpdateData, eventoData }) => {
  const [coordenadas, setCoordenadas] = useState({
    lat: -16.5,
    lng: -68.15,
  });
  const [ubicacion, setUbicacion] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');

  // Mapa de coordenadas de los departamentos
  const departamentoCoordenadas = {
    'La Paz': { lat: -16.500000, lng: -68.119300 },
    'Oruro': { lat: -17.9833, lng: -67.1167 },
    'Potosi': { lat: -19.5842, lng: -65.7456 },
    'Cochabamba': { lat: -17.3902, lng: -66.1568 },
    'Chuquisaca': { lat: -19.0333, lng: -65.2600 },
    'Tarija': { lat: -21.5310, lng: -64.7295 },
    'Pando': { lat: -11.0046, lng: -68.1122 },
    'Beni': { lat: -14.8333, lng: -64.9000 },
    'Santa Cruz': { lat: -17.7775, lng: -63.1815 }
  };

  // Si hay datos previos en eventoData, cargarlos en los estados
  useEffect(() => {
    if (eventoData && eventoData.ubicacion) {
      setUbicacion(eventoData.ubicacion.ubicacion || '');
      setDepartamento(eventoData.ubicacion.departamento || '');
      setDescripcion(eventoData.ubicacion.descripcion || '');
      setLatitud(eventoData.ubicacion.latitud);
      setLongitud(eventoData.ubicacion.longitud);
    }
  }, [eventoData]);

  // Manejar el cambio del select de departamento
  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDepartamento(selectedDepartamento);

    // Actualizar las coordenadas del mapa según el departamento seleccionado
    if (departamentoCoordenadas[selectedDepartamento]) {
      setCoordenadas(departamentoCoordenadas[selectedDepartamento]);
    }

    // Guardar en el estado global sin incluir latLng
    handleUpdateData('ubicacion', {
      ubicacion,
      departamento: selectedDepartamento,
      descripcion,
      latitud,
      longitud
    });
  };

  const handleMapClick = useCallback((event) => {
    const nuevaUbicacion = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setCoordenadas(nuevaUbicacion);
    setLatitud(nuevaUbicacion.lat);
    setLongitud(nuevaUbicacion.lng);
    getDireccion(nuevaUbicacion);
  }, []);

  const getDireccion = async (location) => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps aún no está disponible');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const latLng = new window.google.maps.LatLng(location.lat, location.lng);

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        setUbicacion(results[0]?.formatted_address || '');
      } else {
        console.error('No se pudo obtener la dirección');
      }
    });
  };

  // Manejar el cambio de descripcion
  const handleDescripcionChange = (e) => {
    const nuevaDescripcion = e.target.value;
    setDescripcion(nuevaDescripcion);
    // Guardar en el estado global, sin incluir latLng
    handleUpdateData('ubicacion', { 
      ubicacion, 
      departamento,
      descripcion: nuevaDescripcion,
      latitud,
      longitud
    });
  };

  return (
    <LoadScriptNext googleMapsApiKey='AIzaSyAe7R4Unx1CgViEuc1jDEvdEIDsO5mGMAk'>
      <div className="p-4">
        <form className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-center py-4">Paso 4: Ubicación del evento</h3>
          {/* Campo departamento */}
          <div className="mb-4">
            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
            <select
              id="departamento"
              value={departamento}
              onChange={handleDepartamentoChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Seleccione un departamento</option>
              <option value="La Paz">La Paz</option>
              <option value="Oruro">Oruro</option>
              <option value="Potosi">Potosi</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="Chuquisaca">Chuquisaca</option>
              <option value="Tarija">Tarija</option>
              <option value="Pando">Pando</option>
              <option value="Beni">Beni</option>
              <option value="Santa Cruz">Santa Cruz</option>
            </select>
          </div>

          {/* Campo ubicación */}
          <div className="mb-4">
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación</label>
            <input
              type="text"
              id="ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled
            />
          </div>

          {/* Mapa de Google */}
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={coordenadas}
            zoom={10}
            onClick={handleMapClick}
          >
            <Marker position={coordenadas} />
          </GoogleMap>

          {/* Campo descripción */}
          <div className="mb-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={handleDescripcionChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Botones */}
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
              onClick={() => {
                handleUpdateData('ubicacion', { 
                  ubicacion, 
                  departamento,
                  descripcion,
                  latitud,
                  longitud
                });
                siguientePaso();
              }}
              className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </LoadScriptNext>
  );
};

export default UbicacionEvento;
