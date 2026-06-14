import { ArrowRight, Check, Users } from 'lucide-react'
import { CABINS } from '../data'

export default function Cabins() {
  return <section className="cabins section" id="cabanas">
    <div className="wrap">
      <div className="section-head"><div><p className="eyebrow">Nuestras cabañas</p><h2>Un espacio para<br />cada forma de descansar.</h2></div><p>Ambientes cálidos, equipamiento esencial y ese silencio que solo se encuentra en el sur.</p></div>
      <div className="cabins__grid">
        {CABINS.map((cabin, index) => <article className="cabin-card" key={cabin.name}>
          <div className="cabin-card__image"><img src={cabin.image} alt={`${cabin.name}, ${cabin.type}`} loading="lazy" /><span>0{index + 1}</span></div>
          <div className="cabin-card__body">
            <p className="cabin-card__type">{cabin.type}</p><h3>{cabin.name}</h3><p>{cabin.description}</p>
            <div className="capacity"><Users size={17} /> {cabin.capacity}</div>
            <ul>{cabin.features.map(f => <li key={f}><Check size={14} />{f}</li>)}</ul>
            <div className="card-actions"><a className="button button--dark" href={cabin.bookingUrl} target="_blank" rel="noreferrer" aria-label={`Reservar ${cabin.name}`}>Reservar</a><a className="text-link" href="#preguntas">Ver detalles <ArrowRight size={16} /></a></div>
          </div>
        </article>)}
      </div>
    </div>
  </section>
}
