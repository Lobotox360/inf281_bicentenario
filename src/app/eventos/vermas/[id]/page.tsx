// src/app/evento/[id]/page.tsx

'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/app/componentes/inicio/navbar'
import Link from 'next/link'

const eventos = {
  "La Paz": [
    {
      id: 1,
      title: "SERENATA 6 DE AGOSTO",
      description: "Ven y disfruta de la Serenata conmemorando el aniversario de Bolivia en la Plaza Murillo a las 18:00 PM.",
      categoria: "musica",
      image: "/assets/ads.jpg",
      location: "Plaza Murillo, La Paz",
    },
    {
      id: 2,
      title: "FESTIVAL DE DANZA",
      description: "Una noche llena de cultura, danza y música tradicional en el centro de La Paz.",
      image: "/assets/ads2.jpg",
      categoria: "musica",
      location: "Centro Cultural, La Paz",
    },
  ],
  "Oruro": [],
  "Potosí": [],
}

export default function EventoPage() {
  const { id } = useParams()
  const eventoId = Number(id)

  // Buscar evento por ID en todos los departamentos
  const evento = Object.values(eventos)
    .flat()
    .find((e) => e.id === eventoId)

  if (!evento) {
    return <div className="p-10 text-red-600 text-center">Evento no encontrado 😢</div>
  }

  return (
    <div className='py-35'>
      <Navbar/>
      <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 text-center">{evento.title}</h1>
        
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <Image
            src={evento.image}
            alt={evento.title}
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
          <div className="text-gray-700 text-lg">
            <p className="mb-4"><strong>Descripción:</strong> {evento.description}</p>
            <p><strong>Ubicación:</strong> {evento.location}</p>
          </div>
            
        </div>
        <div className='flex justify-end'>
          <Link href={'../'} className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-yellow-400">
            VOLVER
          </Link>
        </div>
      </div>
    </div>
  )
}
