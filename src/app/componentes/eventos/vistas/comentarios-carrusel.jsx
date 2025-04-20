import { useState, useEffect } from 'react';

const ModuloComentarios = ({eventoId}) => {
  // Estados para almacenar el comentario y la calificación
  const [idUsuario, setIdUsuario] = useState(null);
  const [comentarioUsuario, setComentarioUsuario] = useState(""); 
  const [puntuacionUsuario, setPuntuacionUsuario] = useState("");
  
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
      id_evento: eventoId, 
      comentario: comentarioUsuario, 
      calificacion: parseInt(puntuacionUsuario),
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

      const calificacionRes = await fetch("'https://inf281-production.up.railway.app/agenda/calificacion", {
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

      const comentarioData = await comentarioRes.json();
      const calificacionData = await calificacionRes.json();
      alert(`Comentario y calificación agregados correctamente.`);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu solicitud.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Calificación:</label>
          <select value={puntuacionUsuario} onChange={handlePuntuacionChange}>
            <option value="" disabled>Calificación</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div>
          <label>Comentario:</label>
          <textarea 
            value={comentarioUsuario} 
            onChange={handleComentarioChange} 
            placeholder="Escribe tu comentario aquí" 
            rows="4" 
            cols="50"
          />
        </div>

        <button type="submit">Enviar Comentario y Calificación</button>
      </form>

      {message && <p>{message}</p>} {/* Muestra el mensaje de la respuesta de la API */}
    </div>
  );
};

export default ModuloComentarios;
