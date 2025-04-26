'use client';

import React, { useState } from 'react';
import { FaGoogle, FaApple, FaFacebook, FaEnvelope, FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { BsInstagram } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import Link from 'next/link';

const Login = ({ openModal }) => {
  const [visible, setVisible] = useState(false);
  const [captchaValido, setCaptchaValido] = useState(false);
  const router = useRouter();
  const { register, formState: { errors }, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!captchaValido) {
      alert('Por favor, completa el reCAPTCHA.');
      return;
    }

    try {
      const response = await fetch('https://inf281-production.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, contrasena: data.contrasenia }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Login exitoso:', result);

        if (result.access_token && result.id) {
          localStorage.setItem('access_token', result.access_token);
          localStorage.setItem('id_user', result.id);
          localStorage.setItem('rol', result.rol);
        }

        alert('✅ Inicio de sesión exitoso.');
        const idRol = localStorage.getItem('rol');
        switch (idRol) {
            case 'usuario_casual':
                router.push('/');
                break;
            case 'Administrador':
                router.push('/roles');
                break;
            case 'administrador_eventos':
                router.push('/eventos-admin');
                break;
            case 'administrador_contenido':
                router.push('/contenido');
                break;
            default:
                router.push('/'); // Si el rol no es reconocido, redirigir a la página principal
        }
      } else {
        throw new Error(result.message || 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      alert('❌ Error al iniciar sesión. Verifica tu correo y contraseña.');
    }
  };

  const handleCaptcha = (value) => {
    setCaptchaValido(!!value);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20">
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
            <ReCAPTCHA sitekey="6LeatewqAAAAADCca47eNlhaCay-xYm91cPgMSNr" onChange={handleCaptcha} />
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
    </div>
  );
};

export default Login;
