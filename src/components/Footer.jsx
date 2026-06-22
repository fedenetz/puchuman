import { AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import { BUSINESS, CONTACT } from "../data";
import TrackedLink from "./TrackedLink";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <img
            src="/media/brand/logo-white-230.webp"
            alt={BUSINESS.publicName}
            width="230"
            height="230"
            loading="lazy"
            decoding="async"
          />
          <p>Casas y cabañas familiares equipadas en Lican Ray.</p>
        </div>
        <div>
          <h3>Explorar</h3>
          <a href="/cabanas/">Cabañas</a>
          <a href="/#experiencias">Experiencias</a>
          <a href="/#galeria">Galería</a>
          <a href="/politicas-de-reserva/">Políticas de reserva</a>
          <a href="/contacto/">Contacto</a>
          <a href="/privacidad/">Privacidad y cookies</a>
        </div>
        <div>
          <h3>Contacto</h3>
          <TrackedLink
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            eventName="generate_lead"
            analyticsParams={{ cta_location: "footer" }}
            includeOutboundUrl={false}
          >
            <MessageCircle />
            {CONTACT.whatsappDisplay}
          </TrackedLink>
          <TrackedLink
            href={`mailto:${CONTACT.email}`}
            eventName="click_email"
            analyticsParams={{ cta_location: "footer" }}
            includeOutboundUrl={false}
          >
            <Mail />
            {CONTACT.email}
          </TrackedLink>
          <a
            href={`https://www.instagram.com/${CONTACT.instagram}/`}
            target="_blank"
            rel="noreferrer"
          >
            <AtSign />@{CONTACT.instagram}
          </a>
          <span>
            <MapPin />
            {CONTACT.address}
          </span>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <span>
          © {new Date().getFullYear()} {BUSINESS.publicName}.
        </span>
        <span>Hecho con calma en el sur de Chile.</span>
      </div>
    </footer>
  );
}
