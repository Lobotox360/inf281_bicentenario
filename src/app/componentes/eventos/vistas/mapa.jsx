'use client';
import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api';

const MapaEvento = ({ direccion }) => {
  const [coordenadas, setCoordenadas] = useState(null); // Coordenadas iniciales como null
  const [carga, setCarga] = useState(false); // Inicializamos en true para mostrar el estado de carga

  useEffect(() => {
    if (direccion && typeof window !== 'undefined' && window.google) {
      const geocoder = new window.google.maps.Geocoder();

      // Convertir la dirección en coordenadas
      geocoder.geocode({ address: direccion }, (resultados, estado) => {
        if (estado === window.google.maps.GeocoderStatus.OK) {
          setCoordenadas({
            lat: resultados[0].geometry.location.lat(),
            lng: resultados[0].geometry.location.lng(),
          });
          setCarga(false); // Marca como carga terminada
        } else {
          console.error('Error al obtener la ubicación: ', estado);
          setCarga(false); // Si hay un error, también terminamos la carga
        }
      });
    }
  }, [direccion]); // Se ejecuta cuando cambia la dirección

  return (
    <LoadScriptNext googleMapsApiKey="AIzaSyA4coShq7smfTIjc5MwT9JUTs6_uTv07lA">
      {carga ? (
        <div>Cargando el mapa...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '500px' }}
          center={coordenadas || { lat: -16.5, lng: -68.1193 }}  // Coordenadas predeterminadas razonables si aún no se tienen
          zoom={14}
        >
          {coordenadas && <Marker position={coordenadas} title={direccion} />}
        </GoogleMap>
      )}
    </LoadScriptNext>
  );
};

export default MapaEvento;
