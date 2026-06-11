import { Quote } from 'lucide-react'
const quotes = [
  ['“Personas muy confiables. Ya hemos estado dos veranos y primaveras, y todo ha sido impecable. 100% recomendable, todo muy cerca del lago y restaurante.”','@rfarfan_arriagada','Comentario en Instagram'],
  ['“Las mejores cabañas, nuevas y excelente atención.”','@pau_netzv','Comentario en Instagram'],
  ['“Me encantó mi estadía con ustedes. Las recomiendo totalmente.”','@danireyesr','Comentario en Instagram'],
]
export default function Testimonials() { return <section className="testimonials section wrap"><div className="section-head"><div><p className="eyebrow">Quienes ya estuvieron</p><h2>Descanso contado<br />en primera persona.</h2></div></div><div className="testimonials__grid">{quotes.map(([quote,name,city]) => <blockquote key={name}><Quote /><p>{quote}</p><footer><b>{name}</b><span>{city}</span></footer></blockquote>)}</div></section> }
