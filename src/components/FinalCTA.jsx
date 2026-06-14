import { CalendarDays } from 'lucide-react'
import { BOOKING_URL } from '../data'
export default function FinalCTA() {
  return <section className="final-cta" id="reservar"><div className="final-cta__bg"/><div className="final-cta__content"><img src="/logo-white.png" alt="" /><p className="eyebrow eyebrow--light">Tu próxima pausa</p><h2>Comienza tu<br /><em>escapada al sur.</em></h2><p>Conoce nuestras casas y cabañas para vivir unos días junto al lago.</p><a className="button" href={BOOKING_URL} target="_blank" rel="noreferrer"><CalendarDays /> Reservar online</a></div></section>
}
