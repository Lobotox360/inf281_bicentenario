import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa'; 

const ModuloComentarios = ({eventoId}) => {
  // Estados para almacenar el comentario y la calificación
  const [idUsuario, setIdUsuario] = useState(null);
  const [comentarioUsuario, setComentarioUsuario] = useState(""); 
  const [puntuacionUsuario, setPuntuacionUsuario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  


  useEffect(() => {
    const fetchComentarios = async () => {
        try {
            const response = await fetch(`https://inf281-production.up.railway.app/agenda/comentarios/${eventoId}`); 
            const data = await response.json();
            if (response.ok) {
                setComentarios(data);
            } else {
                console.error('Error al obtener los comentarios');
            }
        } catch (error) {
            console.error('Hubo un problema con la solicitud:', error);
        }
    };
    fetchComentarios();
  }, []);
  
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
      alert("Por favor, selecciona una calificación y agrega un comentario.");
      return;
    }

    const datos = {
      id_usuario: idUsuario, 
      id_evento: parseInt(eventoId), 
      comentario: comentarioUsuario, 
      calificacion: parseInt(puntuacionUsuario)
    };

    try {
      // Enviar el comentario
      const comentarioRes = await fetch('https://inf281-production.up.railway.app/agenda/comentario', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: datos.id_usuario,
          id_evento: datos.id_evento,
          calificacion: datos.calificacion,
        }),
      });

      if (!calificacionRes.ok) {
        throw new Error("Error al agregar la calificación.");
      }

      alert(`Comentario y calificación agregados correctamente.`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      console.log(datos);
      alert("Debes estar agendado a este evento para comentar y calificar.");
    }
  };



  return (
    <div>
      <div className="bg-white p-5 m-4 rounded-lg shadow-lg p-4 mb-4">
        {comentarios.length > 0 ? (
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
            <div className='flex justify-between'>
              <select value={puntuacionUsuario} onChange={handlePuntuacionChange}>
                <option value="" disabled>Calificación</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-yellow-400">
                Enviar Comentario
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ModuloComentarios;
