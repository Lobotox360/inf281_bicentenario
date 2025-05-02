'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 

const VerificarEmail = () => {
  const router = useRouter();
  const [codigo, setCodigo] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailGuardado = localStorage.getItem("email");
    if (emailGuardado) setEmail(emailGuardado);
    else setError("No se encontró el email. Regístrate de nuevo.");
  }, []);

  const reenviarCodigo = async () => {
    if (!email) {
      setError("No se encontró el email. Regístrate de nuevo.");
      return;
    }

    try {
      const response = await fetch("https://inf281-production.up.railway.app/usuario/reenviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMensaje("✅ Nuevo código enviado a tu correo.");
        setError("");
        toast.success("✅ Nuevo código enviado a tu correo.");
      } else {
        throw new Error(result.message || "Error al reenviar el código.");
      }
    } catch (error) {
      console.error("Error en el reenvío:", error);
      setError("Error al reenviar el código. Inténtalo más tarde.");
      toast.error("❌ Error al reenviar el código. Inténtalo más tarde.");
    }
  };

  const handleChange = (index, value) => {
    if (/[^0-9]/.test(value)) return;
    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = value;
    setCodigo(nuevoCodigo);

    if (value !== "" && index < 4) {
      document.getElementById(`codigo-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codigoIngresado = codigo.join("");

    if (!email) {
      setError("No se encontró el email. Regístrate de nuevo.");
      return;
    }

    try {
      const response = await fetch("https://inf281-production.up.railway.app/usuario/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: codigoIngresado }),
      });

      const result = await response.json();

      if (response.ok) {
        setMensaje("✅ Usuario registrado con éxito.");
        setError("");
        toast.success("✅ Usuario registrado con éxito.");
        setTimeout(() => router.push("/login/subirfoto"), 2000);
      } else {
        throw new Error(result.message || "Código incorrecto. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error en la verificación:", error);
      setError("Código incorrecto. Inténtalo de nuevo.");
      toast.error("❌ Código incorrecto. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Verifica tu Email</h2>
        <p className="mb-4 text-black">
          Hemos enviado un código de 5 dígitos a <strong>{email}</strong>. Ingresa el código para verificar tu cuenta.
        </p>

        {mensaje && <p className="text-green-500 mb-4">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-3">
            {codigo.map((num, index) => (
              <input
                key={index}
                id={`codigo-${index}`}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-xl border border-gray-600 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={num}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ))}
          </div>

          {error && <p className="text-orange-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="cursor-pointer w-full mt-4 p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Verificar
          </button>
        </form>

        <button
          className="cursor-pointer mt-4 text-blue-800 hover:underline"
          onClick={reenviarCodigo}
        >
          Volver a enviar código
        </button>
      </div>
      <ToastContainer />  
    </div>
  );
};

export default VerificarEmail;
