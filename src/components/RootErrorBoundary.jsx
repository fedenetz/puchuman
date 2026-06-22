import { Component } from "react";
import { BOOKING_URL, CONTACT } from "../data";
import { reportError } from "../lib/errorMonitoring";
import TrackedLink from "./TrackedLink";

export default class RootErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    reportError(error, "react_error_boundary");
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="fatal-error" id="main-content">
        <div>
          <p className="eyebrow">Cabañas Puchuman Lican Ray</p>
          <h1>Algo no cargó correctamente</h1>
          <p>
            Puedes continuar tu reserva directamente o escribirnos por WhatsApp.
            Estos enlaces funcionan sin la aplicación.
          </p>
          <div className="route-actions">
            <TrackedLink
              className="button"
              href={BOOKING_URL}
              eventName="begin_booking"
              analyticsParams={{ cta_location: "root_error" }}
            >
              Reservar online
            </TrackedLink>
            <TrackedLink
              href={`https://wa.me/${CONTACT.whatsapp}`}
              eventName="generate_lead"
              analyticsParams={{ cta_location: "root_error" }}
              includeOutboundUrl={false}
            >
              Abrir WhatsApp
            </TrackedLink>
            <button type="button" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        </div>
      </main>
    );
  }
}
