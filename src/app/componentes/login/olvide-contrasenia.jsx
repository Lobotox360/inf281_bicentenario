'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const Recuperar = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [emailEnviado, setEmailEnviado] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("https://inf281-production.up.railway.app/login/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        throw new Error("No se pudo enviar el correo. Inténtalo de nuevo.");
      }

      setEmailEnviado(true);
      console.log("✅ Correo de recuperación enviado a:", data.email);

      // Mostrar notificación de éxito
      toast.success("¡Correo enviado! Revisa tu bandeja de entrada.");

      // Opcional: Redireccionar al usuario después de unos segundos
      setTimeout(() => router.push('/login'), 4000);

    } catch (error) {
      console.error("Error en la recuperación de contraseña:", error);
      
      // Mostrar notificación de error
      toast.error("Error al enviar el correo. Verifica tu dirección e inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4 text-red-600">¿Has olvidado tu contraseña?</h2>

        <p className="text-black text-sm text-center mb-6">
          Introduce tu dirección de correo electrónico. Te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {emailEnviado ? (
          <p className="text-green-500 text-center mb-4">✅ ¡Correo enviado! Revisa tu bandeja de entrada.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block font-medium text-black mb-2">Tu e-mail:</label>
            <input
              type="email"
              placeholder="Tu e-mail"
              className="w-full p-2 border rounded-md text-black"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: { value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, message: "Correo inválido" }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <button
              type="submit"
              className="cursor-pointer w-full mt-6 p-3 bg-orange-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Enviar enlace de recuperación
            </button>
          </form>
        )}
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default Recuperar;
