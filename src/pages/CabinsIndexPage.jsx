import { CABINS, STAY_FACTS } from "../data";
import PageLayout from "../components/PageLayout";
import TrackedLink from "../components/TrackedLink";
import ResponsiveImage from "../components/ResponsiveImage";

export default function CabinsIndexPage() {
  return (
    <PageLayout>
      <section className="page-hero page-hero--compact">
        <div className="wrap">
          <nav className="breadcrumbs" aria-label="Migas de pan">
            <a href="/">Inicio</a>
            <span aria-hidden="true">/</span>
            <span>Cabañas</span>
          </nav>
          <p className="eyebrow eyebrow--light">Alojamiento en Lican Ray</p>
          <h1>Cabañas y casas en Lican Ray</h1>
          <p>Opciones para familias y grupos de 4 a 8 personas.</p>
        </div>
      </section>
      <section className="availability-note">
        <div className="wrap">
          <strong>Tarifas sin promesas desactualizadas.</strong>
          <span>{STAY_FACTS.availability}</span>
        </div>
      </section>
      <section className="route-section">
        <div className="wrap route-card-grid">
          {CABINS.map((cabin) => (
            <article className="route-card" key={cabin.id}>
              <ResponsiveImage
                image={cabin.image}
                sizes="(max-width: 760px) calc(100vw - 40px), 50vw"
              />
              <div>
                <p className="eyebrow">{cabin.type}</p>
                <h2>{cabin.name}</h2>
                <p>{cabin.shortDescription}</p>
                <p>
                  {cabin.capacity.label} · {cabin.bedrooms.label} ·{" "}
                  {cabin.bathrooms.label}
                </p>
                <div className="route-actions">
                  <TrackedLink
                    className="button button--dark"
                    href={cabin.futureDetailUrl}
                    eventName="select_item"
                    analyticsParams={{
                      cta_location: "cabins_index",
                      item_id: cabin.id,
                      item_name: cabin.name,
                    }}
                    includeOutboundUrl={false}
                  >
                    Ver detalles
                  </TrackedLink>
                  <TrackedLink
                    className="text-link"
                    href={cabin.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    eventName="begin_booking"
                    analyticsParams={{
                      cta_location: "cabins_index",
                      item_id: cabin.id,
                      item_name: cabin.name,
                    }}
                  >
                    Reservar
                  </TrackedLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
