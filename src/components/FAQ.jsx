import { useState } from 'react'
import { Plus } from 'lucide-react'
const items = [
  ['¿Dónde están ubicadas las cabañas?','Estamos en Lican Ray, Región de La Araucanía. La dirección exacta y las indicaciones de llegada se comparten al confirmar la reserva.'],
  ['¿Las cabañas están equipadas?','Sí. Todas cuentan con cocina equipada, ropa de cama, baño privado y espacios preparados para una estadía cómoda.'],
  ['¿Se puede ir en familia?','Claro. Tenemos alternativas para parejas y grupos familiares de hasta seis personas.'],
  ['¿Hay estacionamiento?','Sí, contamos con estacionamiento para huéspedes dentro del recinto.'],
  ['¿Cómo puedo reservar?','El motor de reservas online estará disponible próximamente. Mientras tanto, puedes consultar información y disponibilidad directamente por WhatsApp.'],
  ['¿Aceptan mascotas?','Política por confirmar. Consúltanos antes de reservar para revisar tu caso.'],
]
export default function FAQ() {
  const [open, setOpen] = useState(0)
  return <section className="faq section" id="preguntas"><div className="wrap faq__grid"><div><p className="eyebrow">Antes de venir</p><h2>Preguntas<br />frecuentes.</h2><p>Lo esencial para que puedas planificar tu estadía con tranquilidad.</p></div><div className="accordion">{items.map(([q,a],i) => <div className={`accordion__item ${open===i?'is-open':''}`} key={q}><button onClick={() => setOpen(open===i ? -1 : i)} aria-expanded={open===i}><span>{q}</span><Plus /></button><div className="accordion__answer"><p>{a}</p></div></div>)}</div></div></section>
}
