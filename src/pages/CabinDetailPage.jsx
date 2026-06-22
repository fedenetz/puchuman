import { CABINS, STAY_FACTS } from "../data";
import PageLayout from "../components/PageLayout";
import TrackedLink from "../components/TrackedLink";
import ResponsiveImage from "../components/ResponsiveImage";

export default function CabinDetailPage({ cabin }) {
  const relatedCabins = CABINS.filter(({ id }) => id !== cabin.id).slice(0, 3);

  return (
    <PageLayout>
      <section className="page-hero page-hero--detail">
        <div className="wrap">
          <nav className="breadcrumbs" aria-label="Migas de pan">
            <a href="/">Inicio</a>
            <span aria-hidden="true">/</span>
            <a href="/cabanas/">Cabañas</a>
            <span aria-hidden="true">/</span>
            <span>{cabin.name}</span>
          </nav>
          <p className="eyebrow eyebrow--light">{cabin.type}</p>
          <h1>{cabin.name}</h1>
          <p>{cabin.shortDescription}</p>
        </div>
      </section>
      <section className="route-section">
        <div className="wrap detail-grid">
          <div className="detail-image">
            <ResponsiveImage
              image={cabin.image}
              sizes="(max-width: 760px) calc(100vw - 40px), 52vw"
              loading="eager"
            />
          </div>
          <div className="detail-copy">
            <p className="eyebrow">Información de la cabaña</p>
            <h2>Comodidad para tu estadía</h2>
            <p>{cabin.longDescription}</p>
            <p>
              <strong>Ubicación:</strong> {cabin.addressCopy},{" "}
              {cabin.locationCopy}.
            </p>
            <dl className="detail-facts">
              <div>
                <dt>Capacidad</dt>
                <dd>{cabin.capacity.label}</dd>
              </div>
              <div>
                <dt>Dormitorios</dt>
                <dd>{cabin.bedrooms.label}</dd>
              </div>
              <div>
                <dt>Baños</dt>
                <dd>{cabin.bathrooms.label}</dd>
              </div>
            </dl>
            <h3>Características</h3>
            <ul className="detail-features">
              {cabin.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
            <div className="route-actions">
              <TrackedLink
                className="button button--dark"
                href={cabin.bookingUrl}
                target="_blank"
                rel="noreferrer"
                eventName="begin_booking"
                analyticsParams={{
                  cta_location: "cabin_detail",
                  item_id: cabin.id,
                  item_name: cabin.name,
                }}
              >
                Reservar online
              </TrackedLink>
              {cabin.googleMapsUrl && (
                <TrackedLink
                  className="text-link"
                  href={cabin.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  eventName="get_directions"
                  analyticsParams={{
                    cta_location: "cabin_detail",
                    item_id: cabin.id,
                    item_name: cabin.name,
                  }}
                >
                  Ver en Google Maps
                </TrackedLink>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="route-section route-section--booking">
        <div className="wrap booking-info-grid">
          <div>
            <p className="eyebrow">Tarifas y disponibilidad</p>
            <h2>Revisa el valor para tus fechas</h2>
            <p>{STAY_FACTS.availability}</p>
            <TrackedLink
              className="button button--dark"
              href={cabin.bookingUrl}
              target="_blank"
              rel="noreferrer"
              eventName="begin_booking"
              analyticsParams={{
                cta_location: "cabin_pricing",
                item_id: cabin.id,
                item_name: cabin.name,
              }}
            >
              Ver disponibilidad y tarifa
            </TrackedLink>
          </div>
          <div className="stay-facts">
            <article>
              <h3>Check-in</h3>
              <p>{STAY_FACTS.checkIn}</p>
            </article>
            <article>
              <h3>Check-out</h3>
              <p>{STAY_FACTS.checkOut}</p>
            </article>
            <article>
              <h3>Mascotas</h3>
              <p>{STAY_FACTS.pets}</p>
            </article>
            <article>
              <h3>Dentro de la unidad</h3>
              <p>{STAY_FACTS.smoking}</p>
            </article>
          </div>
        </div>
      </section>
      <section className="route-section">
        <div className="wrap decision-note">
          <div>
            <p className="eyebrow">Antes de reservar</p>
            <h2>Confirma lo importante para tu grupo</h2>
            <p>{STAY_FACTS.clarification}</p>
          </div>
          <a className="text-link" href="/politicas-de-reserva/">
            Ver políticas de reserva
          </a>
        </div>
      </section>
      <section className="route-section route-section--muted">
        <div className="wrap">
          <p className="eyebrow">Otras opciones</p>
          <h2>También puedes conocer</h2>
          <div className="related-links">
            {relatedCabins.map((related) => (
              <a href={related.futureDetailUrl} key={related.id}>
                {related.name} · {related.capacity.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
