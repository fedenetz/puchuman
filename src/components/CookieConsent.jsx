import { useEffect, useState } from "react";
import { getAnalyticsConsent, setAnalyticsConsent } from "../lib/analytics";

export default function CookieConsent() {
  const [consent, setConsent] = useState(getAnalyticsConsent);

  useEffect(() => {
    const sync = () => setConsent(getAnalyticsConsent());
    window.addEventListener("puchuman:analytics-consent", sync);
    return () => window.removeEventListener("puchuman:analytics-consent", sync);
  }, []);

  if (consent !== "pending") return null;

  const choose = (value) => {
    setAnalyticsConsent(value);
    setConsent(value);
  };

  return (
    <aside className="consent-banner" aria-label="Preferencias de analitica">
      <div>
        <strong>Tu privacidad importa</strong>
        <p>
          Usamos analitica opcional para entender que contenido resulta util. No
          se carga hasta que aceptes. <a href="/privacidad/">Ver detalles</a>
        </p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" onClick={() => choose("denied")}>
          Rechazar
        </button>
        <button
          className="button"
          type="button"
          onClick={() => choose("granted")}
        >
          Aceptar analitica
        </button>
      </div>
    </aside>
  );
}
