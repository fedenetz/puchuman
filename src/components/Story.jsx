import { ArrowUpRight } from "lucide-react";
import { STORY_IMAGE } from "../data";
import ResponsiveImage from "./ResponsiveImage";

export default function Story() {
  return (
    <section className="story section wrap">
      <div className="story__image">
        <ResponsiveImage
          image={STORY_IMAGE}
          sizes="(max-width: 680px) calc(100vw - 28px), 50vw"
        />
        <span>Calma para volver a lo simple</span>
      </div>
      <div className="story__copy">
        <p className="eyebrow">Por qué Puchuman</p>
        <h2>
          El sur se disfruta
          <br />a otro ritmo.
        </h2>
        <p className="lead">
          Casas y cabañas familiares equipadas para disfrutar Lican Ray.
        </p>
        <p>
          La estadía incluye estacionamiento y acceso a quincho con parrilla
          para asados. Nuestras ubicaciones están a una cuadra de Playa Grande o
          Playa Chica, según el alojamiento.
        </p>
        <a className="text-link" href="#ubicacion">
          Conoce el entorno <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  );
}
