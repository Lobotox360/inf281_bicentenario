'use client';
import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScriptNext } from '@react-google-maps/api';

const MapaEvento = ({ latitud, longitud, direccion }) => {
  const [coordenadas, setCoordenadas] = useState({ lat: latitud, lng: longitud });
  const [carga, setCarga] = useState(false);

  useEffect(() => {
    setCoordenadas({ lat: latitud, lng: longitud });
  }, [latitud, longitud]);

  return (
    <LoadScriptNext googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
      {carga ? (
        <div>Cargando el mapa...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '500px' }}
          center={coordenadas || { lat: -16.5, lng: -68.1193 }}  // Coordenadas predeterminadas razonables si aún no se tienen
          zoom={17}
        >
          {coordenadas && <Marker position={coordenadas} title={direccion}/>}
        </GoogleMap>
      )}
    </LoadScriptNext>
  );
};

export default MapaEvento;
