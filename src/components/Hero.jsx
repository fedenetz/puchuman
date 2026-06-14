import { ArrowDown, CalendarDays } from 'lucide-react'
import { BOOKING_URL } from '../data'

export default function Hero() {
  return <section className="hero" id="inicio">
    <div className="hero__bg" />
    <div className="hero__content reveal">
      <p className="eyebrow eyebrow--light">Cabañas · Lican Ray · Araucanía</p>
      <h1>Tu descanso<br /><em>junto al lago.</em></h1>
      <p>Cabañas en Lican Ray para descansar entre lago, volcán y naturaleza.</p>
      <div className="hero__actions">
        <a className="button" href={BOOKING_URL} target="_blank" rel="noreferrer"><CalendarDays size={18} /> Reservar online</a>
        <a className="text-link text-link--light" href="#cabanas">Ver cabañas <ArrowDown size={17} /></a>
      </div>
    </div>
    <div className="hero__aside"><span>39.4835° S</span><i /><span>72.1493° O</span></div>
  </section>
}
