import { ArrowRight, Check, Users } from "lucide-react";
import { CABINS } from "../data";
import TrackedLink from "./TrackedLink";
import ResponsiveImage from "./ResponsiveImage";

export default function Cabins() {
  return (
    <section className="cabins section" id="cabanas">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Nuestras cabañas</p>
            <h2>
              Un espacio para
              <br />
              cada forma de descansar.
            </h2>
          </div>
          <p>
            Casas y cabañas familiares equipadas, con opciones para grupos de 4
            a 8 personas.
          </p>
        </div>
        <div className="cabins__grid">
          {CABINS.map((cabin) => (
            <article className="cabin-card" key={cabin.id}>
              <div className="cabin-card__image">
                <ResponsiveImage
                  image={cabin.image}
                  sizes="(max-width: 680px) calc(100vw - 28px), (max-width: 1200px) 46vw, 265px"
                />
                <span>0{cabin.displayOrder}</span>
              </div>
              <div className="cabin-card__body">
                <p className="cabin-card__type">{cabin.type}</p>
                <h3>{cabin.name}</h3>
                <p>{cabin.shortDescription}</p>
                <div className="capacity">
                  <Users size={17} /> {cabin.capacity.label}
                </div>
                <ul>
                  {cabin.amenities.map((amenity) => (
                    <li key={amenity}>
                      <Check size={14} />
                      {amenity}
                    </li>
                  ))}
                </ul>
                <div className="card-actions">
                  <TrackedLink
                    className="button button--dark"
                    href={cabin.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Reservar ${cabin.name}`}
                    eventName="begin_booking"
                    analyticsParams={{
                      cta_location: "cabin_card",
                      item_id: cabin.id,
                      item_name: cabin.name,
                    }}
                  >
                    Reservar
                  </TrackedLink>
                  <TrackedLink
                    className="text-link"
                    href={cabin.futureDetailUrl}
                    eventName="select_item"
                    analyticsParams={{
                      cta_location: "cabin_card",
                      item_id: cabin.id,
                      item_name: cabin.name,
                    }}
                    includeOutboundUrl={false}
                  >
                    Ver detalles <ArrowRight size={16} />
                  </TrackedLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
