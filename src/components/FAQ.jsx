import { useState } from 'react'
import { Plus } from 'lucide-react'
const items = [
  ['¿Qué incluye la estadía?','Casas y cabañas familiares completamente equipadas, estacionamiento y acceso a quincho con parrilla para asados. Estamos a una cuadra de Playa Grande de Lican Ray.'],
  ['¿Cuáles son los horarios de check-in y check-out?','El check-in es desde las 15:00 hrs y el check-out hasta las 11:00 hrs, previa revisión de la unidad. Las llegadas después de las 19:00 hrs deben coordinarse con la administración.'],
  ['¿Cómo se calcula la cantidad de huéspedes?','Toda persona mayor de 3 años se considera huésped. Las personas adicionales que no hayan sido informadas al reservar tienen un recargo de $10.000 por persona sobre la tarifa base.'],
  ['¿Cuál es la política de cancelación?','La cancelación es gratuita hasta 15 días antes de la fecha original de la reserva. En pagos con tarjeta de débito o crédito se retiene un 5% por cargo de servicio al realizar la devolución.'],
  ['¿Puedo cambiar la fecha de mi reserva?','Sí. Puedes solicitar un cambio hasta 7 días antes de la fecha original. La solicitud debe enviarse a puchuman.licanray@gmail.com y está sujeta a disponibilidad.'],
  ['¿Aceptan mascotas?','Sí, previa autorización expresa de la administración. Debes traer sus comederos, cobertores y cama, retirar sus desechos y mantenerla con correa fuera de la cabaña. Se solicitará una garantía equivalente a una noche adicional por posibles daños o suciedad.'],
  ['¿Se puede fumar dentro de las casas o cabañas?','No. Está estrictamente prohibido fumar dentro de las unidades. El incumplimiento tiene una multa de 0,5 UF.'],
  ['¿Qué normas de convivencia debo considerar?','Se debe cuidar el mobiliario y los elementos a gas, leña o fuego, evitar ruidos molestos y respetar el descanso de los vecinos. Los daños o pérdidas ocasionados durante la estadía serán cobrados al huésped responsable.'],
  ['¿Puedo usar calefactores eléctricos?','No se permite su uso sin autorización de la administración. En caso de aprobarse, tiene un costo de $6.000 por día. La corriente eléctrica es de 220 volts.'],
  ['¿Cómo puedo reservar?','Puedes revisar disponibilidad, elegir tus fechas y reservar directamente desde nuestro motor de reservas online.'],
]
export default function FAQ() {
  const [open, setOpen] = useState(0)
  return <section className="faq section" id="preguntas"><div className="wrap faq__grid"><div><p className="eyebrow">Antes de venir</p><h2>Preguntas<br />frecuentes.</h2><p>Lo esencial para que puedas planificar tu estadía con tranquilidad.</p></div><div className="accordion">{items.map(([q,a],i) => <div className={`accordion__item ${open===i?'is-open':''}`} key={q}><button onClick={() => setOpen(open===i ? -1 : i)} aria-expanded={open===i}><span>{q}</span><Plus /></button><div className="accordion__answer"><p>{a}</p></div></div>)}</div></div></section>
}
