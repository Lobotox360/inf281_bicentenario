'use client';

import React, { useState } from 'react';
import { FaGoogle, FaApple, FaFacebook, FaEnvelope, FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { BsInstagram } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify'; // Importamos Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importamos el CSS de Toastify

const Login = ({ openModal }) => {
  const [visible, setVisible] = useState(false);
  const [captchaValido, setCaptchaValido] = useState(false);
  const router = useRouter();
  const { register, formState: { errors }, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!captchaValido) {
      toast.error('Por favor, completa el reCAPTCHA.');
      return;
    }

    try {
      const res = await fetch('https://inf281-production.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, contrasena: data.contrasenia }),
      });

      const resultado = await res.json();

      if (res.ok) {
        console.log('Login exitoso:', resultado);

        if (resultado.access_token && resultado.id) {
          localStorage.setItem('access_token', resultado.access_token);
          localStorage.setItem('id_user', resultado.id);
          localStorage.setItem('rol', resultado.rol);
        }

        toast.success('Inicio de sesión exitoso.');
        const idRol = localStorage.getItem('rol');
        const redireccionar = (ruta) => setTimeout(() => router.push(ruta), 2000);
        switch (idRol) {
          case 'usuario_casual':
            redireccionar('/');
            break;
          case 'Administrador':
            redireccionar('/dashboard');
            break;
          case 'administrador_eventos':
            redireccionar('/dashboard');
            break;
          case 'administrador_contenido':
            redireccionar('/dashboard');
            break;
          default:
            redireccionar('/');
        }
      } else {
        throw new Error(resultado.message || 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      toast.error('❌ Error al iniciar sesión. Verifica tu correo y contraseña.');
    }
  };

  const handleCaptcha = (value) => {
    setCaptchaValido(!!value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">Iniciar Sesión con</h2>

        <div className="flex justify-center space-x-4 mb-6">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl hover:bg-blue-600">
            <FaFacebook />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-500 text-white text-2xl hover:bg-pink-600">
            <BsInstagram />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-400 text-white text-2xl hover:bg-blue-500">
            <FaGoogle />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white text-2xl hover:bg-gray-600">
            <FaApple />
          </button>
        </div>

        <div className="flex justify-center items-center mb-2.5">
          <div className="w-[200px] h-[10px] bg-gradient-to-r from-red-500 via-yellow-200 to-green-600 rounded-[9px]"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center border border-gray-300 p-3 rounded-md bg-gray-100">
            <FaEnvelope className="text-gray-600" />
            <input
              type="email"
              placeholder="Dirección Email"
              {...register('email', { required: 'Este campo es obligatorio' })}
              className="bg-transparent border-none outline-none w-full text-gray-700 ml-2"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <div className="flex items-center border border-gray-300 p-3 rounded-md bg-gray-100 relative">
            <FaLock className="text-gray-600" />
            <input
              type={visible ? 'text' : 'password'}
              placeholder="Contraseña"
              {...register('contrasenia', { required: 'Este campo es obligatorio' })}
              className="bg-transparent border-none outline-none w-full text-gray-700 ml-2"
            />
            <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 text-gray-600 cursor-pointer">
              {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
          {errors.contrasenia && <p className="text-red-500 text-sm">{errors.contrasenia.message}</p>}

          <div className="flex justify-center">
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_CAPTCHA_API_KEY} onChange={handleCaptcha} />
          </div>

          <div className="text-center text-sm text-gray-600">
            ¿Olvidaste tu contraseña? <Link href="/login/recuperar" className="text-blue-600 cursor-pointer hover:text-purple-600">Haz clic aquí</Link>
          </div>
          <div className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta? <span onClick={openModal} className="text-blue-600 cursor-pointer hover:text-purple-600">Regístrate aquí</span>
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition cursor-pointer">
            Iniciar Sesión
          </button>
        </form>
      </div>

      {/* Aquí se renderiza el ToastContainer */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default Login;
