import { CalendarDays } from 'lucide-react'
export default function FinalCTA() {
  return <section className="final-cta" id="reservar"><div className="final-cta__bg"/><div className="final-cta__content"><img src="/logo-white.png" alt="" /><p className="eyebrow eyebrow--light">Tu próxima pausa</p><h2>Comienza tu<br /><em>escapada al sur.</em></h2><p>Conoce nuestras casas y cabañas para vivir unos días junto al lago.</p><span className="booking-control booking-control--light"><button className="button button--disabled" disabled><CalendarDays /> Reservar online</button><small>Motor de reservas próximamente</small></span></div></section>
}
