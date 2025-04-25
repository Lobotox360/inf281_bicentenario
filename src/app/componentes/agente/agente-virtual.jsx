import { useState, useEffect, useRef } from "react";
import BarraHistorial from "./barra-lateral";
import Navbar from '../inicio/navbar';

export default function AgenteVirtual() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [grabando, setGrabando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "es-BO";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript;
      setPregunta(texto);
    };

    if (grabando) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [grabando]);

  const enviarPregunta = () => {
    if (!pregunta.trim()) return;

    const nuevaEntrada = { pregunta, respuesta: "" };
    setHistorial((prev) => [...prev, nuevaEntrada]);
    setPregunta("");

    let respuestaSimulada = "Esta es una respuesta generada progresivamente.";
    let i = 0;
    const interval = setInterval(() => {
      setHistorial((prev) => {
        const nuevoHistorial = [...prev];
        const index = nuevoHistorial.length - 1;
        nuevoHistorial[index] = {
          ...nuevoHistorial[index],
          respuesta: nuevoHistorial[index].respuesta + respuestaSimulada[i],
        };
        return nuevoHistorial;
      });
      i++;
      if (i >= respuestaSimulada.length) clearInterval(interval);
    }, 50);
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

  return (
    <><Navbar />
        <div className="mt-20 min-h-screen bg-gradient-to-b from-red-600 to-green-600 flex flex-col items-center justify-center p-4 text-white relative">
          <BarraHistorial historial={historial} />
          <h1 className="text-4xl font-bold mb-6 text-center">Agente Virtual del Bicentenario</h1>

          <div className="w-full max-w-3xl bg-white/10 p-6 rounded-2xl shadow-xl">
              <div
                  ref={chatRef}
                  className="h-96 overflow-y-auto bg-white/20 rounded-xl p-4 space-y-4"
              >
                  {historial.map((item, index) => (
                      <div key={index} className="bg-white/10 p-3 rounded-lg">
                          <p className="font-semibold text-yellow-200">🧑‍💬 {item.pregunta}</p>
                          <p className="text-white whitespace-pre-wrap">{item.respuesta}</p>
                      </div>
                  ))}
              </div>
              <label className="block mt-3 mb-2 text-lg">Haz tu pregunta:</label>
              <div className="flex flex-col gap-2 mb-4 sm:flex-row">
                  <input
                      type="text"
                      value={pregunta}
                      onChange={(e) => setPregunta(e.target.value)}
                      className="flex-1 p-3 rounded-lg text-black"
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
      </div></>
  );
}