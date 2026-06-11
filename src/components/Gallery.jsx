import { GALLERY } from '../data'
export default function Gallery() {
  return <section className="gallery section" id="galeria"><div className="wrap"><div className="section-head"><div><p className="eyebrow">Postales del sur</p><h2>Así se siente<br />estar aquí.</h2></div><p>Lago, bosque y tardes largas. Una selección del paisaje que acompaña cada estadía.</p></div><div className="gallery__grid">{GALLERY.map(([src, alt], i) => <figure key={src} className={`gallery__item gallery__item--${i+1}`}><img src={src} alt={alt} loading="lazy" /><figcaption>{String(i+1).padStart(2,'0')} · {alt}</figcaption></figure>)}</div></div></section>
}
