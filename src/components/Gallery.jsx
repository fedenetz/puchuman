import { GALLERY } from "../data";
import ResponsiveImage from "./ResponsiveImage";

export default function Gallery() {
  return (
    <section className="gallery section" id="galeria">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Postales del sur</p>
            <h2>
              Así se siente
              <br />
              estar aquí.
            </h2>
          </div>
          <p>
            Lago, bosque y tardes largas. Una selección del paisaje que acompaña
            cada estadía.
          </p>
        </div>
        <div className="gallery__grid">
          {GALLERY.map((image, index) => (
            <figure
              key={image.src}
              className={`gallery__item gallery__item--${index + 1}`}
            >
              <ResponsiveImage
                image={image}
                sizes="(max-width: 680px) 100vw, (max-width: 1180px) 50vw, 560px"
              />
              <figcaption>
                {String(index + 1).padStart(2, "0")} · {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
