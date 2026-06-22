import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import { CONTACT } from "../data";
import PageLayout from "../components/PageLayout";
import TrackedLink from "../components/TrackedLink";

export default function ContactPage() {
  return (
    <PageLayout>
      <section className="page-hero page-hero--compact">
        <div className="wrap">
          <nav className="breadcrumbs" aria-label="Migas de pan">
            <a href="/">Inicio</a>
            <span aria-hidden="true">/</span>
            <span>Contacto</span>
          </nav>
          <p className="eyebrow eyebrow--light">Cabañas Puchuman Lican Ray</p>
          <h1>Contacto y ubicación</h1>
          <p>
            Comunícate con nosotros o revisa nuestras opciones en Lican Ray.
          </p>
        </div>
      </section>
      <section className="route-section">
        <div className="wrap contact-grid">
          <div>
            <p className="eyebrow">Contacto directo</p>
            <h2>Estamos en Lican Ray</h2>
            <p>
              Las ubicaciones específicas de cada alojamiento están disponibles
              en su página y enlace de Google Maps.
            </p>
          </div>
          <address className="contact-list">
            <TrackedLink
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              eventName="generate_lead"
              analyticsParams={{ cta_location: "contact_page" }}
              includeOutboundUrl={false}
            >
              <MessageCircle /> WhatsApp: {CONTACT.whatsappDisplay}
            </TrackedLink>
            <TrackedLink
              href={`mailto:${CONTACT.email}`}
              eventName="click_email"
              analyticsParams={{ cta_location: "contact_page" }}
              includeOutboundUrl={false}
            >
              <Mail /> {CONTACT.email}
            </TrackedLink>
            <a
              href={`https://www.instagram.com/${CONTACT.instagram}/`}
              target="_blank"
              rel="noreferrer"
            >
              <AtSign /> @{CONTACT.instagram}
            </a>
            <span>
              <MapPin /> {CONTACT.address}
            </span>
            <span>Atención solo por WhatsApp; no se reciben llamadas.</span>
          </address>
        </div>
      </section>
    </PageLayout>
  );
}
