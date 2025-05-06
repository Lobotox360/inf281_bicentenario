'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles

const EditarUbicacionEvento = ({ eventoId }) => {
  const [coordenadas, setCoordenadas] = useState({
    lat: -16.5,
    lng: -68.15,
  });
  const [ubicacion, setUbicacion] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [ubicacionID, setUbicacionID] = useState(null);
  const token = localStorage.getItem("access_token");
  const router = useRouter();

  useEffect(() => {
    const fetchEventoData = async () => {
      try {
        if (!token) {throw new Error("Acceso denegado");}
        const response = await fetch(`https://inf281-production.up.railway.app/eventos/ubicacion/${eventoId}`, {headers: {"Authorization": `Bearer ${token}`}});
        const data = await response.json();
        if (data) {
          setUbicacionID(data.ubicacion.id_ubicacion || '');
          setUbicacion(data.ubicacion.ubicacion || '');
          setDepartamento(data.ubicacion.departamento || '');
          setDescripcion(data.ubicacion.descripcion || '');
          setLatitud(data.ubicacion.latitud || -16.5);
          setLongitud(data.ubicacion.longitud || -68.15);

          setCoordenadas({
            lat: data.ubicacion.lat || -16.5,
            lng: data.ubicacion.lng || -68.15,
          });
        } else {
          console.error('No se encontraron datos del evento');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventoData();
  }, [eventoId]);

  const departamentoCoordenadas = {
    'La Paz': { lat: -16.500000, lng: -68.119300 },
    'Oruro': { lat: -17.9833, lng: -67.1167 },
    'Potosi': { lat: -19.5842, lng: -65.7456 },
    'Cochabamba': { lat: -17.3902, lng: -66.1568 },
    'Chuquisaca': { lat: -19.0333, lng: -65.2600 },
    'Tarija': { lat: -21.5310, lng: -64.7295 },
    'Pando': { lat: -11.0046, lng: -68.1122 },
    'Beni': { lat: -14.8333, lng: -64.9000 },
    'Santa Cruz': { lat: -17.7775, lng: -63.1815 },
  };

  const handleMapClick = useCallback((event) => {
    const nuevaUbicacion = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setLatitud(nuevaUbicacion.lat);
    setLongitud(nuevaUbicacion.lng);
    setCoordenadas(nuevaUbicacion);
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

  const geolocalizarUbicacion = async (direccion) => {
    if (!direccion) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: direccion }, (results, status) => {
      if (status === 'OK') {
        const latLng = results[0].geometry.location;
        const nuevaUbicacion = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };

        setCoordenadas(nuevaUbicacion);
        setLatitud(nuevaUbicacion.lat);
        setLongitud(nuevaUbicacion.lng);
        setUbicacion(results[0].formatted_address);
      } else {
        console.error('No se pudo encontrar la ubicación: ' + status);
      }
    });
  };

  const handleBuscarUbicacion = () => {
    if (!ubicacion) return;
    geolocalizarUbicacion(ubicacion);
  };

  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDepartamento(selectedDepartamento);

    if (departamentoCoordenadas[selectedDepartamento]) {
      setCoordenadas(departamentoCoordenadas[selectedDepartamento]);
    }
  };

  const handleDescripcionChange = (e) => {
    setDescripcion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {throw new Error("Acceso denegado");}
      const response = await fetch(`https://inf281-production.up.railway.app/eventos/ubicacion/${ubicacionID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ubicacion,
          departamento,
          descripcion,
          latitud,
          longitud,
        }),
      });

      if (response.ok) {
        toast.success('Evento actualizado exitosamente');
      } else {
        toast.error('Error al actualizar el evento');
      }
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      toast.error('Error al actualizar el evento');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <LoadScriptNext googleMapsApiKey='AIzaSyAe7R4Unx1CgViEuc1jDEvdEIDsO5mGMAk'>
        <div className="p-4 max-w-4xl mx-auto">
          <form className="bg-white p-5 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-center py-4">Editar Ubicación del Evento</h3>

            <div className="mb-4">
              <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
              <select
                id="departamento"
                value={departamento}
                onChange={handleDepartamentoChange}
                className="cursor-pointer w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>Seleccione un departamento</option>
                {Object.keys(departamentoCoordenadas).map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>

            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación</label>
            <div className="flex justify-between mb-4">
              <input
                type="text"
                id="ubicacion"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={handleBuscarUbicacion}
                className="cursor-pointer bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-400"
              >
                Buscar
              </button>
            </div>

            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={coordenadas}
              zoom={12}
              onClick={handleMapClick}
            >
              <Marker position={coordenadas} />
            </GoogleMap>

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

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="cursor-pointer bg-red-500 text-white py-2 px-4 rounded-full hover:bg-orange-400"
              >
                Salir sin guardar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400"
              >
                Guardar cambios y salir
              </button>
            </div>
          </form>
        </div>
      </LoadScriptNext>

      <ToastContainer/>
    </>
  );
};

export default EditarUbicacionEvento;
