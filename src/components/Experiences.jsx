import {
  CookingPot,
  MountainSnow,
  MoonStar,
  Umbrella,
  UsersRound,
  Waves,
} from "lucide-react";

const items = [
  [Waves, "Lago"],
  [MountainSnow, "Volcán"],
  [Umbrella, "Playa"],
  [CookingPot, "Parrilla"],
  [UsersRound, "Familia"],
  [MoonStar, "Descanso"],
];

export default function Experiences() {
  return (
    <section className="experiences section wrap" id="experiencias">
      <div className="experiences__intro">
        <p className="eyebrow">Entorno y estadía</p>
        <h2>
          Lican Ray
          <br />a tu ritmo.
        </h2>
        <p>
          Lago, volcán y playa describen el entorno. La estadía incluye acceso a
          quincho con parrilla para asados.
        </p>
      </div>
      <div className="experiences__grid">
        {items.map(([Icon, label]) => (
          <div className="experience" key={label}>
            <Icon />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
