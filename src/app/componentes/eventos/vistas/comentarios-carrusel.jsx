import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';  // Importar Toastify
import 'react-toastify/dist/ReactToastify.css';  // Estilos de Toastify

const ModuloComentarios = ({eventoId}) => {
  // Estados para almacenar el comentario y la calificación
  const [idUsuario, setIdUsuario] = useState(null);
  const token = localStorage.getItem("access_token");
  const [comentarioUsuario, setComentarioUsuario] = useState(""); 
  const [puntuacionUsuario, setPuntuacionUsuario] = useState("");
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await fetch(`https://inf281-production.up.railway.app/agenda/comentarios/${eventoId}`);
        const datos = await res.json();
        if (res.ok) {
          setComentarios(datos);
        } else {
          console.error('Error al obtener los comentarios');
          setComentarios([]);
        }
      } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
      }
    };

    if (eventoId) {
      fetchComentarios();
    }
  }, [eventoId]);
  
  useEffect(() => {
    const id = localStorage.getItem('id_user');
    if (id) {
      setIdUsuario(id); 
    }
  }, []);

  const handlePuntuacionChange = (event) => {
    setPuntuacionUsuario(event.target.value); 
  };

  const handleComentarioChange = (event) => {
    setComentarioUsuario(event.target.value); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if (!puntuacionUsuario || !comentarioUsuario) {
      toast.error("Por favor, selecciona una calificación y agrega un comentario."); 
      return;
    }

    const datos = {
      id_usuario: idUsuario, 
      id_evento: parseInt(eventoId), 
      comentario: comentarioUsuario, 
      calificacion: parseInt(puntuacionUsuario)
    };

    try {
      if (!token) {throw new Error("Acceso denegado");}
      const comentarioRes = await fetch('https://inf281-production.up.railway.app/agenda/comentario', {
        method: "POST",
        headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
        body: JSON.stringify({
          id_usuario: datos.id_usuario,
          id_evento: datos.id_evento,
          comentario: datos.comentario,
        }),
      });

      if (!comentarioRes.ok) {
        throw new Error("Error al agregar el comentario.");
      }
      const calificacionRes = await fetch('https://inf281-production.up.railway.app/agenda/calificacion', {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify({
          id_usuario: datos.id_usuario,
          id_evento: datos.id_evento,
          calificacion: datos.calificacion,
        }),
      });

      if (!calificacionRes.ok) {
        throw new Error("Error al agregar la calificación.");
      }

      toast.success("Comentario y calificación agregados correctamente.");  // Notificación de éxito
      setTimeout(() => {window.location.reload()}, 3000);
    } catch (error) {
      console.error(error);
      toast.error("Debes estar agendado a este evento para comentar y calificar.");  // Notificación de error
    }
  };

  return (
    <div>
      <div className="bg-white p-5 m-4 rounded-lg shadow-lg p-4 mb-4">
        {comentarios.length > 0 && !comentarios.every(com => com.comentario === null) ? (
          comentarios.map((com, index) => (
            // Verifica si el comentario no es nulo o vacío antes de mostrar el bloque
            com.comentario && com.comentario.trim() !== "" && (
              <div key={index} className="border-b pb-4 mb-4 flex items-center gap-4">
                {/* Icono de perfil */}
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {com.foto_usuario ? (
                    <Image src={com.foto_usuario} alt={com.nombre_usuario} width={48} height={48} className="object-cover" />
                  ) : (
                    <FaUserCircle size={48} color="#ccc" />
                  )}
                </div>
                {/* Comentario */}
                <div className="flex flex-col">
                  <p className="font-semibold text-gray-900">
                    {com.nombre_usuario} <span className="text-sm text-gray-500"> - {Array.from({length: 5}, (_, index) => index < com.calificacion ? '⭐' : '☆').join(' ')}</span>
                  </p>
                  <p className="text-gray-600">{com.comentario}</p>
                </div>
              </div>
            )
          ))
        ) : (
          <p className="text-center text-gray-500">No hay comentarios aún.</p>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Deja tu comentario</h2>
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg">
            <div className="mb-4">
                <textarea
                id="comment"
                value={comentarioUsuario}
                onChange={(e) => setComentarioUsuario(e.target.value)}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                ></textarea>
            </div>
            <div className='flex flex-col sm:flex-row justify-between'>
              <select value={puntuacionUsuario} onChange={handlePuntuacionChange} className='p-2 mb-2 border-2 border-gray-300 cursor-pointer'>
                <option value="" disabled className='text-center'>Calificación</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded-full cursor-pointer hover:bg-yellow-400">
                Enviar Comentario
              </button>
            </div>
        </form>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default ModuloComentarios;
