import { useState, useEffect, useRef } from "react";
import BarraHistorial from "./barra-lateral";
import Navbar from '../inicio/navbar';
import PiePagina from '../inicio/footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AgenteVirtual() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [grabando, setGrabando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [imagenCargada, setImagenCargada] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (!("webkitSpeechRecognition" in window)) return;
    const reconocer = new webkitSpeechRecognition();
    reconocer.lang = "es-BO";
    reconocer.continuous = false;
    reconocer.interimResults = false;

    reconocer.onresult = (event) => {
      const texto = event.results[0][0].transcript;
      setPregunta(texto);
    };

    if (grabando) {
      reconocer.start();
    } else {
      reconocer.stop();
    }

    return () => reconocer.stop();
  }, [grabando]);

  const enviarPregunta = async () => {
    if (!pregunta.trim()) return;
  
    const nuevaEntrada = { pregunta, respuesta: "" };
    setHistorial((prev) => [...prev, nuevaEntrada]);
    setPregunta(""); 
  
    try {
      const response = await fetch('https://inf281-production.up.railway.app/agente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pregunta }), 
      });
  
      const data = await response.json(); 
      const respuesta = data.respuesta || "No se obtuvo respuesta"; 
  
      let i = 0;
      const interval = setInterval(() => {
        setHistorial((prev) => {
          const nuevoHistorial = [...prev];
          const index = nuevoHistorial.length - 1;
          nuevoHistorial[index] = {
            ...nuevoHistorial[index],
            respuesta: respuesta.slice(0, i),
          };
          return nuevoHistorial;
        });
        i++;
        if (i > respuesta.length) {
          clearInterval(interval);
          setImagenCargada(true); 
        }
      }, 25); 
    } catch (error) {
      console.error("Error al obtener la respuesta:", error);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [historial]);

  const manejarEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      enviarPregunta();
    }
  };

  const renderizaImagen = (respuesta) => {
    const imagenFormato = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))/i;
    const imagenURL = respuesta.match(imagenFormato);
    if (imagenURL) {
      return <img src={imagenURL[0]} alt="Imagen de la respuesta" className="mt-4 rounded-lg mx-auto max-h-80" />;
    }
    return null;
  };

  return (
    <div className="mt-20 min-h-screen bg-gradient-to-b from-red-500 to-green-600 flex flex-col items-center justify-center p-4 text-white relative">
      <BarraHistorial historial={historial} />
      <h1 className="text-4xl font-bold mb-6 text-center" data-aos="fade-up">
        Agente Virtual del Bicentenario
      </h1>
  
      <div className="w-full max-w-3xl bg-white/10 p-6 rounded-2xl shadow-xl" data-aos="fade-up">
        <div
          ref={chatRef}
          className="h-96 overflow-y-auto bg-white/20 rounded-xl p-4 space-y-4"
        >
          {historial.map((item, index) => (
            <div key={index} className="bg-white/10 p-3 rounded-lg">
              <p className="font-semibold text-yellow-200">🧑‍💬 {item.pregunta}</p>

              {/* Mostrar respuesta */}
              <p className="text-white whitespace-pre-wrap break-words">{item.respuesta}</p>

              {/* Solo mostrar la imagen después de que la respuesta esté completamente cargada */}
              {imagenCargada && renderizaImagen(item.respuesta)}
            </div>
          ))}
        </div>
  
        <label className="block mt-3 mb-2 text-lg">Haz tu pregunta:</label>
        <div className="flex flex-col gap-2 mb-4 sm:flex-row">
          <textarea
            type="text"
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            className="border  flex-1 p-3 rounded-lg text-black"
            placeholder="¿Quién fue el primer presidente de Bolivia?"
            onKeyDown={manejarEnter}
          />
  
          <button
            onClick={() => setGrabando((prev) => !prev)}
            className={`cursor-pointer p-3 rounded-lg ${grabando ? "bg-red-500" : "bg-yellow-400"}`}
          >
            🎙️
          </button>
          <button
            onClick={enviarPregunta}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Preguntar
          </button>
        </div>
      </div>
    </div>
  );
}
