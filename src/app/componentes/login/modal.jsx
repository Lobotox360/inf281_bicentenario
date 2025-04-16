'use client';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { CountrySelect, StateSelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Modal = ({ isOpen, onClose }) => {
  const [idPais, setIdPais] = useState(null);
  const [idEstado, setIdEstado] = useState(null);
  const [visible, setVisible] = useState(false);
  const [revisible, setRevisible] = useState(false);
  const { register, watch, formState: { errors }, handleSubmit, setValue } = useForm();
  const contrasena = watch('contrasena');
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`\\-]).{8,}$/;
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      localStorage.setItem('email', data.email); // Guardamos el email para la verificación
      const response = await fetch('https://inf281-production.up.railway.app/usuario/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en el registro, intente nuevamente.');
      }

      const result = await response.json();
      console.log('Registro exitoso:', result);

      // Redirigir después del registro exitoso
      router.push('/login/verificar');
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un problema con el registro.');
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg" onSubmit={handleSubmit(onSubmit)} action="POST">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold">Ingresa tus datos</h2>
          <button className="text-gray-500 hover:text-red-500 text-2xl" onClick={onClose}>&times;</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Nombres {errors.nombre && <span className="text-red-500 text-sm">(campo requerido)</span>}</label>
            <input className="w-full p-2 border rounded-md" type="text" placeholder="Nombres" {...register('nombre', { required: true })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Apellido Paterno <br /> {errors.apellidopaterno && <span className="text-red-500 text-sm">(campo requerido)</span>}</label>
              <input className="w-full p-2 border rounded-md" type="text" placeholder="Apellido Paterno" {...register('apellidopaterno', { required: true })} />
            </div>
            <div>
              <label className="block font-medium">Apellido Materno</label>
              <input className="w-full p-2 border rounded-md" type="text" placeholder="Apellido Materno" {...register('apellidomaterno')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Género {errors.genero && <span className="text-red-500 text-sm">(campo requerido)</span>}</label>
              <select className="w-full p-2 border rounded-md" {...register("genero", { required: true })} defaultValue="">
                <option value="" disabled>Seleccione su género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No binario">Sin comentarios</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Teléfono/Celular</label>
              <input className="w-full p-2 border rounded-md" type="text" placeholder="Telefono" {...register('telefono')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">País {errors.pais && <span className="text-red-500 text-sm">(campo requerido)</span>}</label>
              <CountrySelect
                onChange={(e) => {
                  setIdPais(e.id);
                  setValue("pais", e.name, { shouldValidate: true });
                }}
                placeHolder="Seleccione un país"
              />
              <input type="hidden" {...register("pais", { required: true })} />
            </div>

            <div>
              <label className="block font-medium">Ciudad {errors.ciudad && <span className="text-red-500 text-sm">(campo requerido)</span>}</label>
              <StateSelect
                disabled={!idPais}
                countryid={idPais}
                onChange={(e) => {
                  setIdEstado(e.id);
                  setValue("ciudad", e.name, { shouldValidate: true });
                }}
                placeHolder="Seleccione una ciudad"
              />
              <input type="hidden" {...register("ciudad", { required: true })} />
            </div>
          </div>

          <div>
            <label className="block font-medium">Email {errors.email && <span className="text-red-500 text-sm">(campo requerido)</span>}</label>
            <input className="w-full p-2 border rounded-md" type="email" placeholder="ejemplo@gmail.com" {...register('email', { required: true })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">
                Contraseña
                {errors.contrasena?.type === 'required' && <span className="text-red-500 text-sm"> (campo requerido)</span>}
                {errors.contrasena?.type === 'pattern' && <span className="text-red-500 text-sm"> (Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial)</span>}
              </label>
              <div className="relative">
                <input
                  className="w-full p-2 border rounded-md pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  type={visible ? "text" : "password"}
                  placeholder="Contraseña"
                  {...register('contrasena', {
                    required: true,
                    pattern: {
                      value: passwordRegex,
                      message: "Debe contener 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial"
                    }
                  })}
                />
                <button
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  type="button"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium">
                Repita contraseña
                <br />{errors.recontrasenia?.type === 'required' && <span className="text-red-500 text-sm"> (campo requerido)</span>}
                {errors.recontrasenia?.type === 'validate' && <span className="text-red-500 text-sm"> (las contraseñas no coinciden)</span>}
              </label>
              <div className="relative">
                <input
                  className="w-full p-2 border rounded-md pr-10"
                  type={revisible ? "text" : "password"}
                  placeholder="Repita su contraseña"
                  {...register('recontrasenia', {
                    required: true,
                    validate: value => value === contrasena || "Las contraseñas no coinciden"
                  })}
                />
                <button
                  className="absolute right-3 top-3 text-gray-500"
                  type="button"
                  onClick={() => setRevisible(!revisible)}
                >
                  {revisible ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Guardar
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
