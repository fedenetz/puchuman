import { CalendarDays } from "lucide-react";
import { BOOKING_URL, FINAL_CTA_IMAGE } from "../data";
import TrackedLink from "./TrackedLink";
import ResponsiveImage from "./ResponsiveImage";

export default function FinalCTA() {
  return (
    <section className="final-cta" id="reservar">
      <ResponsiveImage
        className="final-cta__media"
        image={FINAL_CTA_IMAGE}
        sizes="100vw"
      />
      <div className="final-cta__content">
        <img
          src="/media/brand/logo-mark-200.webp"
          alt=""
          width="200"
          height="200"
          loading="lazy"
          decoding="async"
        />
        <p className="eyebrow eyebrow--light">Tu próxima pausa</p>
        <h2>
          Comienza tu
          <br />
          <em>escapada al sur.</em>
        </h2>
        <p>
          Conoce nuestras casas y cabañas para vivir unos días junto al lago.
        </p>
        <TrackedLink
          className="button"
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          eventName="begin_booking"
          analyticsParams={{ cta_location: "final_cta" }}
        >
          <CalendarDays /> Reservar online
        </TrackedLink>
      </div>
    </section>
  );
}
