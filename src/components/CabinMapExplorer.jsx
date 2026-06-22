import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import {
  Bath,
  BedDouble,
  CalendarDays,
  ExternalLink,
  Users,
} from "lucide-react";
import { CABINS } from "../data";
import TrackedLink from "./TrackedLink";
import ResponsiveImage from "./ResponsiveImage";

const placeLabels = [
  {
    label: "Lican Ray",
    position: [-39.48515, -72.1528],
    className: "map-place-label map-place-label--town",
  },
  {
    label: "Lago Calafquén",
    position: [-39.4934, -72.1587],
    className: "map-place-label map-place-label--lake",
  },
  {
    label: "Playa Chica",
    position: [-39.48825, -72.13865],
    className: "map-place-label map-place-label--green",
  },
  {
    label: "Playa Foresta",
    position: [-39.47875, -72.12735],
    className: "map-place-label map-place-label--green",
  },
  {
    label: "Península de Lican Ray",
    position: [-39.49595, -72.1412],
    className:
      "map-place-label map-place-label--green map-place-label--peninsula",
  },
  {
    label: "A Villarrica",
    position: [-39.47865, -72.1647],
    className: "map-place-label map-place-label--route",
  },
  {
    label: "A Coñaripe",
    position: [-39.47875, -72.1196],
    className: "map-place-label map-place-label--route",
  },
];

function createPinIcon(cabin, isActive) {
  return L.divIcon({
    className: `leaflet-cabin-pin ${isActive ? "is-active" : ""}`,
    html: `<span aria-hidden="true">${cabin.displayOrder}</span>`,
    iconSize: [44, 52],
    iconAnchor: [22, 49],
  });
}

function createLabelIcon(place) {
  return L.divIcon({
    className: place.className,
    html: `<span aria-hidden="true">${place.label}</span>`,
    iconSize: [160, 28],
    iconAnchor: [80, 14],
  });
}

function MapSync({ cabin }) {
  const map = useMap();

  useEffect(() => {
    const position = [cabin.coordinates.lat, cabin.coordinates.lng];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.setView(position, map.getZoom(), { animate: false });
    } else {
      map.flyTo(position, map.getZoom(), { duration: 0.55 });
    }
  }, [cabin, map]);

  return null;
}

function CabinMarker({ cabin, isActive, onSelect }) {
  const markerRef = useRef(null);
  const icon = useMemo(() => createPinIcon(cabin, isActive), [cabin, isActive]);

  useEffect(() => {
    const element = markerRef.current?.getElement();
    element?.setAttribute("aria-label", `Ver ubicación de ${cabin.name}`);
    element?.setAttribute("role", "button");
    element?.setAttribute("tabindex", "0");
  }, [cabin]);

  return (
    <Marker
      ref={markerRef}
      position={[cabin.coordinates.lat, cabin.coordinates.lng]}
      icon={icon}
      keyboard
      zIndexOffset={isActive ? 1000 : cabin.displayOrder}
      eventHandlers={{
        click: () => onSelect(cabin.id, true),
        mouseover: () => onSelect(cabin.id),
        keydown: (event) => {
          if (
            event.originalEvent.key === "Enter" ||
            event.originalEvent.key === " "
          ) {
            event.originalEvent.preventDefault();
            onSelect(cabin.id, true);
          }
        },
      }}
    />
  );
}

function PlaceLabelMarker({ place }) {
  const markerRef = useRef(null);

  useEffect(() => {
    const element = markerRef.current?.getElement();
    element?.setAttribute("aria-hidden", "true");
    element?.removeAttribute("role");
    element?.removeAttribute("tabindex");
  }, []);

  return (
    <Marker
      ref={markerRef}
      position={place.position}
      icon={createLabelIcon(place)}
      interactive={false}
      keyboard={false}
    />
  );
}

export default function CabinMapExplorer() {
  const [activeId, setActiveId] = useState(CABINS[0].id);
  const cardRefs = useRef({});
  const activeCabin = useMemo(
    () => CABINS.find((cabin) => cabin.id === activeId) || CABINS[0],
    [activeId],
  );

  const selectCabin = (id, shouldScroll = false) => {
    setActiveId(id);

    if (shouldScroll && window.matchMedia("(max-width: 680px)").matches) {
      cardRefs.current[id]?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  return (
    <section className="cabin-map section" id="ubicacion">
      <div className="wrap cabin-map__grid">
        <div className="cabin-map__intro">
          <h2>Elige tu cabaña en Lican Ray</h2>
          <p className="cabin-map__subtitle">
            Cinco opciones para familias y grupos, con capacidad de 4 a 8
            personas.
          </p>
          <p className="cabin-map__location">
            Cada ficha muestra la dirección y la cercanía a Playa Grande o Playa
            Chica confirmada por Administración.
          </p>
        </div>

        <div className="cabin-map__cards" aria-label="Cabañas disponibles">
          {CABINS.map((cabin) => (
            <article
              className={`explorer-card ${activeId === cabin.id ? "is-active" : ""}`}
              key={cabin.id}
              ref={(node) => {
                cardRefs.current[cabin.id] = node;
              }}
              onMouseEnter={() => selectCabin(cabin.id)}
            >
              <button
                type="button"
                className="explorer-card__select"
                aria-pressed={activeId === cabin.id}
                aria-label={`Mostrar ${cabin.name} en el mapa`}
                onClick={() => selectCabin(cabin.id, true)}
              />
              <ResponsiveImage
                image={cabin.image}
                alt=""
                sizes="(max-width: 680px) 92px, 104px"
              />
              <div className="explorer-card__content">
                <p>{cabin.type}</p>
                <h3>{cabin.name}</h3>
                <dl>
                  <div>
                    <dt>Capacidad</dt>
                    <dd>
                      <Users size={14} />
                      {cabin.capacity.label}
                    </dd>
                  </div>
                  <div>
                    <dt>Dormitorios</dt>
                    <dd>
                      <BedDouble size={14} />
                      {cabin.bedrooms.label}
                    </dd>
                  </div>
                  <div>
                    <dt>Baños</dt>
                    <dd>
                      <Bath size={14} />
                      {cabin.bathrooms.label}
                    </dd>
                  </div>
                </dl>
                <span>{cabin.mapHighlights.join(" · ")}</span>
                <div className="explorer-card__actions">
                  <TrackedLink
                    href={cabin.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Reservar ${cabin.name}`}
                    eventName="begin_booking"
                    analyticsParams={{
                      cta_location: "map_card",
                      item_id: cabin.id,
                      item_name: cabin.name,
                    }}
                  >
                    Reservar
                  </TrackedLink>
                  <a
                    href={cabin.futureDetailUrl}
                    aria-label={`Ver detalles de ${cabin.name}`}
                  >
                    Ver detalles
                  </a>
                  <TrackedLink
                    href={cabin.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ir a Google Maps para ${cabin.name}`}
                    eventName="get_directions"
                    analyticsParams={{
                      cta_location: "map_card",
                      item_id: cabin.id,
                      item_name: cabin.name,
                    }}
                  >
                    Maps
                  </TrackedLink>
                </div>
              </div>
              <span className="explorer-card__pin">{cabin.displayOrder}</span>
            </article>
          ))}
        </div>

        <div className="cabin-map__panel">
          <div
            className="cabin-map__canvas"
            aria-label="Mapa de cabañas en Lican Ray"
          >
            <MapContainer
              center={[-39.4865, -72.1465]}
              zoom={14}
              minZoom={13}
              maxZoom={17}
              scrollWheelZoom={false}
              zoomControl={false}
              attributionControl
              className="cabin-map__leaflet"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />
              <MapSync cabin={activeCabin} />
              {placeLabels.map((place) => (
                <PlaceLabelMarker key={place.label} place={place} />
              ))}
              {CABINS.map((cabin) => (
                <CabinMarker
                  key={cabin.id}
                  cabin={cabin}
                  isActive={activeId === cabin.id}
                  onSelect={selectCabin}
                />
              ))}
            </MapContainer>
          </div>

          <div className="cabin-map__actions">
            <div className="map-selected" aria-live="polite">
              <ResponsiveImage image={activeCabin.image} alt="" sizes="58px" />
              <div>
                <p>{activeCabin.type}</p>
                <h3>{activeCabin.name}</h3>
                <span>
                  <Users size={13} />
                  {activeCabin.capacity.label}
                </span>
                <span>
                  <BedDouble size={13} />
                  {activeCabin.bedrooms.label}
                </span>
                <span>
                  <Bath size={13} />
                  {activeCabin.bathrooms.label}
                </span>
              </div>
            </div>
            <TrackedLink
              className="button button--light-map"
              href={activeCabin.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Reservar ${activeCabin.name}`}
              eventName="begin_booking"
              analyticsParams={{
                cta_location: "map_panel",
                item_id: activeCabin.id,
                item_name: activeCabin.name,
              }}
            >
              <CalendarDays size={17} />
              Reservar
            </TrackedLink>
            <a
              className="button button--outline-map"
              href={activeCabin.futureDetailUrl}
              aria-label={`Ver detalles de ${activeCabin.name}`}
            >
              Ver detalles
            </a>
            <TrackedLink
              className="map-google-link"
              href={activeCabin.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ir a Google Maps para ${activeCabin.name}`}
              eventName="get_directions"
              analyticsParams={{
                cta_location: "map_panel",
                item_id: activeCabin.id,
                item_name: activeCabin.name,
              }}
            >
              Ir a Google Maps <ExternalLink size={16} />
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
