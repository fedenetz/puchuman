import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { BUSINESS, CONTACT } from "../data";
import { getAnalyticsConsent, setAnalyticsConsent } from "../lib/analytics";

export default function PrivacyPage() {
  const [consent, setConsent] = useState(getAnalyticsConsent);
  const choose = (value) => {
    setAnalyticsConsent(value);
    setConsent(value);
  };

  return (
    <PageLayout>
      <section className="page-hero page-hero--compact">
        <div className="wrap">
          <nav className="breadcrumbs" aria-label="Migas de pan">
            <a href="/">Inicio</a>
            <span aria-hidden="true">/</span>
            <span>Privacidad y cookies</span>
          </nav>
          <p className="eyebrow eyebrow--light">Transparencia</p>
          <h1>Privacidad y cookies</h1>
          <p>Tú eliges si permites la analítica no esencial.</p>
        </div>
      </section>
      <section className="route-section">
        <div className="wrap policy-list privacy-copy">
          <article>
            <h2>Responsable y datos utilizados</h2>
            <p>
              {BUSINESS.legalName} es el operador responsable de este sitio. El
              sitio no solicita cuentas ni datos de pago. Los enlaces de
              reserva, WhatsApp, Instagram, Google Maps y OpenStreetMap llevan a
              servicios externos con sus propias políticas.
            </p>
          </article>
          <article>
            <h2>Analítica opcional</h2>
            <p>
              Google Analytics 4 solo se carga si aceptas. Medimos eventos de
              navegación y conversión con parámetros limitados; no enviamos el
              texto de mensajes, email, teléfono ni consultas de URL.
            </p>
            <p>
              Preferencia actual: <strong>{consent}</strong>.
            </p>
            <div className="route-actions">
              <button type="button" onClick={() => choose("denied")}>
                Rechazar o retirar consentimiento
              </button>
              <button type="button" onClick={() => choose("granted")}>
                Aceptar analitica
              </button>
            </div>
          </article>
          <article>
            <h2>Contacto</h2>
            <p>
              Para consultas sobre privacidad, escribe a{" "}
              <a href={`mailto:${CONTACT.privacyEmail}`}>
                {CONTACT.privacyEmail}
              </a>
              .
            </p>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}
