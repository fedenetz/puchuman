import { Waves, MountainSnow, Umbrella, Sailboat, CookingPot, UsersRound, Bike, MoonStar } from 'lucide-react'
const items = [[Waves,'Lago'],[MountainSnow,'Volcán'],[Umbrella,'Playa'],[Sailboat,'Kayak'],[CookingPot,'Parrilla'],[UsersRound,'Familia'],[Bike,'Bicicletas'],[MoonStar,'Descanso']]
export default function Experiences() {
  return <section className="experiences section wrap" id="experiencias"><div className="experiences__intro"><p className="eyebrow">Tiempo bien vivido</p><h2>Días simples.<br />Recuerdos que quedan.</h2><p>Desde una mañana en la playa hasta una tarde de parrilla. Tú eliges cuánto hacer.</p></div><div className="experiences__grid">{items.map(([Icon,label]) => <div className="experience" key={label}><Icon /><span>{label}</span></div>)}</div></section>
}
