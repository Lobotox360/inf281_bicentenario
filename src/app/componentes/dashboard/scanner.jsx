'use client';
import { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import jsQR from 'jsqr';  

export default function Scanner() {
  const [error, setError] = useState(null);
  const [escaneando, setEscaneando] = useState(true);
  const [scannedCode, setScannedCode] = useState("");
  const [mensaje, setMensaje] = useState(""); 
  const [abrirModal, setAbrirModal] = useState(false); 

  const videoRef = useRef(null);
  const canvasRef = useRef(null); 

  useEffect(() => {
    if (escaneando && !abrirModal) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
          requestAnimationFrame(scanQRCode); 
        })
        .catch((err) => {
          setError("Error al acceder a la cámara");
          console.error(err);
        });

      function scanQRCode() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            setScannedCode(code.data); 
            handleRegistrarQR(code.data); 
          }
        }
        if (escaneando && !abrirModal) {
          requestAnimationFrame(scanQRCode);  
        } else if (abrirModal) {
          video.pause();  
        }
      }
    }

    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [escaneando, abrirModal]);

  const handleRegistrarQR = async (tokenQR) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token || !tokenQR) {
        toast.warning("Token de autenticación o token QR no válido");
        return;
      }
      
      const res = await fetch("https://inf281-production.up.railway.app/eventos/asistencia", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenQR })
      });

      if (!res.ok) throw new Error("Error al registrar la asistencia");

      const data = await res.json();
      setMensaje(data.message);
      setAbrirModal(true); 

    } catch (error) {
      console.error("❌ Error:", error);      
      setMensaje("Error al registrar la asistencia");
      setAbrirModal(true);
    }
  };

  const cerrarModal = () => {
    setAbrirModal(false);  
    setEscaneando(true);    
    const video = videoRef.current;
    video.play(); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <video ref={videoRef} style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Modal */}
      {abrirModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="flex flex-col justify-center bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold">{mensaje}</h2>
            <button
              onClick={cerrarModal}
              className="mt-4 cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}
