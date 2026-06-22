import { CalendarDays, MessageCircle } from "lucide-react";
import { BOOKING_URL, CONTACT } from "../data";
import TrackedLink from "./TrackedLink";

export default function MobileConversionBar() {
  return (
    <nav className="mobile-conversion" aria-label="Acciones de reserva">
      <TrackedLink
        href={BOOKING_URL}
        target="_blank"
        rel="noreferrer"
        eventName="begin_booking"
        analyticsParams={{ cta_location: "mobile_sticky" }}
      >
        <CalendarDays /> Ver disponibilidad
      </TrackedLink>
      <TrackedLink
        href={`https://wa.me/${CONTACT.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        eventName="generate_lead"
        analyticsParams={{ cta_location: "mobile_sticky" }}
        includeOutboundUrl={false}
      >
        <MessageCircle /> WhatsApp
      </TrackedLink>
    </nav>
  );
}
