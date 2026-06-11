import { MountainSnow, Heart, Compass, ShieldCheck } from 'lucide-react'

const items = [
  [MountainSnow, 'Natural', 'Conectados con el lago, el volcán y el bosque.'],
  [Heart, 'Cercana', 'Hospitalidad familiar y trato personalizado.'],
  [Compass, 'Auténtica', 'Experiencias reales para conocer Lican Ray.'],
  [ShieldCheck, 'Confiable', 'Limpieza, tranquilidad y descanso asegurado.'],
]
export default function Benefits() {
  return <section className="benefits wrap" aria-label="Nuestros valores">
    {items.map(([Icon, title, text], index) => <article key={title} className="benefit">
      <span className="benefit__number">0{index + 1}</span><Icon /><div><h3>{title}</h3><p>{text}</p></div>
    </article>)}
  </section>
}
