import { POLICY_SECTIONS } from "../data";
import PageLayout from "../components/PageLayout";

export default function PoliciesPage() {
  return (
    <PageLayout>
      <section className="page-hero page-hero--compact">
        <div className="wrap">
          <nav className="breadcrumbs" aria-label="Migas de pan">
            <a href="/">Inicio</a>
            <span aria-hidden="true">/</span>
            <span>Políticas de reserva</span>
          </nav>
          <p className="eyebrow eyebrow--light">Antes de reservar</p>
          <h1>Políticas de reserva</h1>
          <p>Condiciones vigentes para reservas directas.</p>
        </div>
      </section>
      <section className="route-section">
        <div className="wrap policy-list">
          {POLICY_SECTIONS.map(({ title, paragraphs }) => (
            <article key={title}>
              <h2>{title}</h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
