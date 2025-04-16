// components/MapaEvento.js
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
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyA4coShq7smfTIjc5MwT9JUTs6_uTv07lA&libraries=places`}
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

export default MapaEvento;
