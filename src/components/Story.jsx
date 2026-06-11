import { ArrowUpRight } from 'lucide-react'
export default function Story() {
  return <section className="story section wrap">
    <div className="story__image"><img src="/puchuman%20lican%20ray/playa-peninsula-2.jpeg" alt="Vista del lago Calafquén desde la península" loading="lazy" /><span>Calma para volver a lo simple</span></div>
    <div className="story__copy">
      <p className="eyebrow">Por qué Puchuman</p>
      <h2>El sur se disfruta<br />a otro ritmo.</h2>
      <p className="lead">Aquí el día comienza con aire limpio, café sin apuro y el lago a pocos minutos.</p>
      <p>Puchuman nace como un lugar familiar para recibir a quienes buscan descansar de verdad. Cabañas cómodas, atención cercana y una ubicación que permite recorrer Lican Ray o simplemente quedarse a disfrutar del silencio.</p>
      <a className="text-link" href="#ubicacion">Conoce el entorno <ArrowUpRight size={17} /></a>
    </div>
  </section>
}
