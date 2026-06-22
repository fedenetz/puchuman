import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import { ExternalLink, MapPinned } from "lucide-react";
import { CABINS } from "../data";
import TrackedLink from "./TrackedLink";
import { trackEventOnce } from "../lib/analytics";

const CabinMapExplorer = lazy(() => import("./CabinMapExplorer"));

function MapFallback({ onLoad, loading = false, failed = false }) {
  return (
    <section className="map-loader section" id="ubicacion">
      <div className="wrap map-loader__grid">
        <div>
          <p className="eyebrow eyebrow--light">Ubicación</p>
          <h2>Elige tu cabaña en Lican Ray</h2>
          <p>
            El mapa interactivo se carga únicamente cuando lo necesitas. Los
            enlaces directos siguen disponibles aunque el mapa no cargue.
          </p>
          <button
            className="button"
            type="button"
            onClick={onLoad}
            disabled={loading}
          >
            <MapPinned size={18} />
            {loading ? "Cargando mapa…" : "Cargar mapa interactivo"}
          </button>
          {failed && (
            <p className="map-loader__error" role="status">
              El mapa no pudo cargarse. Puedes continuar con los enlaces
              directos.
            </p>
          )}
        </div>
        <div
          className="map-loader__links"
          aria-label="Ubicaciones en Google Maps"
        >
          {CABINS.filter((cabin) => cabin.googleMapsUrl).map((cabin) => (
            <TrackedLink
              key={cabin.id}
              href={cabin.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              eventName="get_directions"
              analyticsParams={{
                cta_location: "map_fallback",
                item_id: cabin.id,
                item_name: cabin.name,
              }}
            >
              {cabin.name} <ExternalLink size={16} />
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}

class MapErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <MapFallback onLoad={() => window.location.reload()} failed />;
    }
    return this.props.children;
  }
}

export default function LazyCabinMapExplorer() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const boundaryRef = useRef(null);

  useEffect(() => {
    if (
      shouldLoad ||
      !boundaryRef.current ||
      !("IntersectionObserver" in window)
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(boundaryRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (shouldLoad) {
      trackEventOnce("view_map:home", "view_map", {
        cta_location: "home_map",
      });
    }
  }, [shouldLoad]);

  if (shouldLoad) {
    return (
      <MapErrorBoundary>
        <Suspense fallback={<MapFallback onLoad={() => {}} loading />}>
          <CabinMapExplorer />
        </Suspense>
      </MapErrorBoundary>
    );
  }

  return (
    <div ref={boundaryRef}>
      <MapFallback onLoad={() => setShouldLoad(true)} />
    </div>
  );
}
