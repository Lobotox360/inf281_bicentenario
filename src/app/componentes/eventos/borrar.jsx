const handleSubmit = async (event) => {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario

  // Validar que se haya seleccionado una calificación y se haya ingresado un comentario
  if (!puntuacionUsuario || !comentarioUsuario) {
    alert("Por favor, selecciona una calificación y agrega un comentario.");
    return;
  }

  // Datos para enviar a la API
  const data = {
    id_usuario: 'd0e631df-cde8-4753-b21f-2ff597efd4a6', // ID del usuario (puedes obtenerlo dinámicamente)
    id_evento: 2, // ID del evento
    comentario: comentarioUsuario, // Comentario del usuario
    calificacion: parseInt(puntuacionUsuario), // Calificación seleccionada
  };

  try {
    // Enviar los datos al servidor para agregar el comentario
    const comentarioResponse = await fetch("/agenda/comentario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_usuario: data.id_usuario,
        id_evento: data.id_evento,
        comentario: data.comentario,
      }),
    });

    // Verificar si la respuesta fue exitosa
    if (!comentarioResponse.ok) {
      throw new Error("Error al agregar el comentario.");
    }

    // Enviar los datos al servidor para agregar la calificación
    const calificacionResponse = await fetch("/agenda/calificacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_usuario: data.id_usuario,
        id_evento: data.id_evento,
        calificacion: data.calificacion,
      }),
    });

    // Verificar si la respuesta de calificación fue exitosa
    if (!calificacionResponse.ok) {
      throw new Error("Error al agregar la calificación.");
    }

    // Si ambas respuestas fueron exitosas, mostrar el mensaje
    const comentarioData = await comentarioResponse.json();
    const calificacionData = await calificacionResponse.json();
  } catch (error) {
    console.error(error);
  }
};
