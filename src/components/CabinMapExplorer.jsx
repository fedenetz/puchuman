import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import { ArrowUpRight, Bath, BedDouble, CalendarDays, Car, ExternalLink, Navigation, Users } from 'lucide-react'
import { CABINS } from '../data'

const byName = Object.fromEntries(CABINS.map((cabin) => [cabin.name, cabin]))

const cabins = [
  {
    id: 'rafael-mera',
    number: 1,
    name: 'Casa Rafael Mera',
    category: byName['Casa Rafael Mera'].type,
    capacity: byName['Casa Rafael Mera'].capacity,
    bedrooms: '3 habitaciones',
    bathrooms: '2 baños',
    features: ['Estacionamiento', 'Entorno verde'],
    image: byName['Casa Rafael Mera'].image,
    googleMapsUrl: 'https://maps.app.goo.gl/AnXJSM8o9NBi6vDGA',
    detailsUrl: '#cabanas',
    bookingUrl: byName['Casa Rafael Mera'].bookingUrl,
    coordinates: { lat: -39.489361, lng: -72.160417 },
  },
  {
    id: 'colinanco',
    number: 2,
    name: 'Casa Coliñanco',
    category: byName['Casa Coliñanco'].type,
    capacity: byName['Casa Coliñanco'].capacity,
    bedrooms: '4 habitaciones',
    bathrooms: '1 baño',
    features: ['Espacios comunes', 'Mayor capacidad'],
    image: byName['Casa Coliñanco'].image,
    googleMapsUrl: 'https://maps.app.goo.gl/KevJ6umWZLkmsj7J6',
    detailsUrl: '#cabanas',
    bookingUrl: byName['Casa Coliñanco'].bookingUrl,
    coordinates: { lat: -39.489917, lng: -72.159944 },
  },
  {
    id: 'mariposa',
    number: 3,
    name: 'Cabaña Mariposa',
    category: byName['Cabaña Mariposa'].type,
    capacity: byName['Cabaña Mariposa'].capacity,
    bedrooms: '2 dormitorios',
    bathrooms: '1 baño',
    features: ['Práctica', 'Acogedora'],
    image: byName['Cabaña Mariposa'].image,
    googleMapsUrl: 'https://maps.app.goo.gl/A9WdhKc3TuoarEur8',
    detailsUrl: '#cabanas',
    bookingUrl: byName['Cabaña Mariposa'].bookingUrl,
    coordinates: { lat: -39.489917, lng: -72.159944 },
  },
  {
    id: 'cariman',
    number: 4,
    name: 'Casa Cariman',
    category: byName['Casa Cariman'].type,
    capacity: byName['Casa Cariman'].capacity,
    bedrooms: '3 habitaciones',
    bathrooms: '1 baño',
    features: ['Estacionamiento'],
    image: byName['Casa Cariman'].image,
    googleMapsUrl: 'https://maps.app.goo.gl/LikxWopHp5w5ZjNs9',
    detailsUrl: '#cabanas',
    bookingUrl: byName['Casa Cariman'].bookingUrl,
    coordinates: { lat: -39.489667, lng: -72.150944 },
  },
  {
    id: 'cariman-interior',
    number: 5,
    name: 'Casa Cariman Interior',
    category: byName['Casa Cariman Interior'].type,
    capacity: byName['Casa Cariman Interior'].capacity,
    bedrooms: '3 habitaciones',
    bathrooms: '1 baño',
    features: ['Opción tranquila', 'Funcional'],
    image: byName['Casa Cariman Interior'].image,
    googleMapsUrl: 'https://maps.app.goo.gl/LikxWopHp5w5ZjNs9',
    detailsUrl: '#cabanas',
    bookingUrl: byName['Casa Cariman Interior'].bookingUrl,
    coordinates: { lat: -39.489667, lng: -72.150944 },
  },
]

const placeLabels = [
  { label: 'Lican Ray', position: [-39.48515, -72.1528], className: 'map-place-label map-place-label--town' },
  { label: 'Lago Calafquén', position: [-39.4934, -72.1587], className: 'map-place-label map-place-label--lake' },
  { label: 'Playa Chica', position: [-39.48825, -72.13865], className: 'map-place-label map-place-label--green' },
  { label: 'Playa Foresta', position: [-39.47875, -72.12735], className: 'map-place-label map-place-label--green' },
  { label: 'Península de Lican Ray', position: [-39.49595, -72.1412], className: 'map-place-label map-place-label--green map-place-label--peninsula' },
  { label: 'A Villarrica', position: [-39.47865, -72.1647], className: 'map-place-label map-place-label--route' },
  { label: 'A Coñaripe', position: [-39.47875, -72.1196], className: 'map-place-label map-place-label--route' },
]

function createPinIcon(cabin, isActive) {
  return L.divIcon({
    className: `leaflet-cabin-pin ${isActive ? 'is-active' : ''}`,
    html: `<span role="button" aria-label="Ver ubicación de ${cabin.name}" tabindex="0">${cabin.number}</span>`,
    iconSize: [42, 52],
    iconAnchor: [21, 49],
  })
}

function createLabelIcon(place) {
  return L.divIcon({
    className: place.className,
    html: `<span>${place.label}</span>`,
    iconSize: [160, 28],
    iconAnchor: [80, 14],
  })
}

function MapSync({ cabin }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([cabin.coordinates.lat, cabin.coordinates.lng], map.getZoom(), { duration: 0.55 })
  }, [cabin, map])

  return null
}

function CabinMarker({ cabin, isActive, onSelect }) {
  const markerRef = useRef(null)
  const icon = useMemo(() => createPinIcon(cabin, isActive), [cabin, isActive])

  useEffect(() => {
    const element = markerRef.current?.getElement()
    element?.setAttribute('aria-label', `Ver ubicación de ${cabin.name}`)
    element?.setAttribute('role', 'button')
    element?.setAttribute('tabindex', '0')
  }, [cabin])

  return <Marker
    ref={markerRef}
    position={[cabin.coordinates.lat, cabin.coordinates.lng]}
    icon={icon}
    keyboard
    zIndexOffset={isActive ? 1000 : cabin.number}
    eventHandlers={{
      click: () => onSelect(cabin.id, true),
      mouseover: () => onSelect(cabin.id),
      focus: () => onSelect(cabin.id),
      keydown: (event) => {
        if (event.originalEvent.key === 'Enter' || event.originalEvent.key === ' ') {
          event.originalEvent.preventDefault()
          onSelect(cabin.id, true)
        }
      },
    }}
  />
}

export default function CabinMapExplorer() {
  const [activeId, setActiveId] = useState(cabins[0].id)
  const cardRefs = useRef({})
  const activeCabin = useMemo(() => cabins.find((cabin) => cabin.id === activeId) || cabins[0], [activeId])

  const selectCabin = (id, shouldScroll = false) => {
    setActiveId(id)

    if (shouldScroll && window.matchMedia('(max-width: 680px)').matches) {
      cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  const onCardKeyDown = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectCabin(id)
    }
  }

  return <section className="cabin-map section" id="ubicacion">
    <div className="wrap cabin-map__grid">
      <div className="cabin-map__intro">
        <h2>Elige tu cabaña en Lican Ray</h2>
        <p className="cabin-map__subtitle">Ubicaciones tranquilas, cerca del lago y con opciones para parejas, familias y grupos.</p>
        <p className="cabin-map__location">Cabañas ubicadas en sectores estratégicos de Lican Ray, con acceso al lago, comercio local y rutas hacia Villarrica y Coñaripe.</p>
      </div>

      <div className="cabin-map__cards" aria-label="Cabañas disponibles">
        {cabins.map((cabin) => (
          <article
            className={`explorer-card ${activeId === cabin.id ? 'is-active' : ''}`}
            key={cabin.id}
            ref={(node) => { cardRefs.current[cabin.id] = node }}
            tabIndex="0"
            role="button"
            aria-pressed={activeId === cabin.id}
            aria-label={`Seleccionar ${cabin.name}`}
            onMouseEnter={() => selectCabin(cabin.id)}
            onFocus={() => selectCabin(cabin.id)}
            onClick={() => selectCabin(cabin.id)}
            onKeyDown={(event) => onCardKeyDown(event, cabin.id)}
          >
            <img src={cabin.image} alt={`${cabin.name}, ${cabin.category}`} loading="lazy" />
            <div className="explorer-card__content">
              <p>{cabin.category}</p>
              <h3>{cabin.name}</h3>
              <dl>
                <div><dt>Capacidad</dt><dd><Users size={14} />{cabin.capacity}</dd></div>
                <div><dt>Dormitorios</dt><dd><BedDouble size={14} />{cabin.bedrooms}</dd></div>
                <div><dt>Baños</dt><dd><Bath size={14} />{cabin.bathrooms}</dd></div>
              </dl>
              <span>{cabin.features.join(' · ')}</span>
              <div className="explorer-card__actions">
                <a href={cabin.bookingUrl} target="_blank" rel="noopener noreferrer" aria-label={`Reservar ${cabin.name}`} onClick={(event) => event.stopPropagation()}>Reservar</a>
                <a href={cabin.detailsUrl} aria-label={`Ver detalles de ${cabin.name}`} onClick={(event) => event.stopPropagation()}>Ver detalles</a>
                <a href={cabin.googleMapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ir a Google Maps para ${cabin.name}`} onClick={(event) => event.stopPropagation()}>Maps</a>
              </div>
            </div>
            <span className="explorer-card__pin">{cabin.number}</span>
          </article>
        ))}
      </div>

      <div className="cabin-map__panel">
        <div className="cabin-map__canvas" aria-label="Mapa de cabañas en Lican Ray">
          <MapContainer
            center={[-39.4865, -72.1465]}
            zoom={14}
            minZoom={13}
            maxZoom={17}
            scrollWheelZoom={false}
            zoomControl={false}
            attributionControl={false}
            className="cabin-map__leaflet"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ZoomControl position="bottomright" />
            <MapSync cabin={activeCabin} />
            {placeLabels.map((place) => <Marker key={place.label} position={place.position} icon={createLabelIcon(place)} interactive={false} />)}
            {cabins.map((cabin) => <CabinMarker key={cabin.id} cabin={cabin} isActive={activeId === cabin.id} onSelect={selectCabin} />)}
          </MapContainer>

          <div className="map-directions" aria-label="Cómo llegar">
            <b><Car size={18} />Cómo llegar</b>
            <a href="https://www.google.com/maps/dir/Villarrica/Lican+Ray" target="_blank" rel="noopener noreferrer"><Navigation size={15} />A Villarrica <ArrowUpRight size={15} /></a>
            <a href="https://www.google.com/maps/dir/Coñaripe/Lican+Ray" target="_blank" rel="noopener noreferrer"><Navigation size={15} />A Coñaripe <ArrowUpRight size={15} /></a>
          </div>

        </div>

        <div className="cabin-map__actions">
          <div className="map-selected" aria-live="polite">
            <img src={activeCabin.image} alt="" />
            <div>
              <p>{activeCabin.category}</p>
              <h3>{activeCabin.name}</h3>
              <span><Users size={13} />{activeCabin.capacity}</span>
              <span><BedDouble size={13} />{activeCabin.bedrooms}</span>
              <span><Bath size={13} />{activeCabin.bathrooms}</span>
            </div>
          </div>
          <a className="button button--light-map" href={activeCabin.bookingUrl} target="_blank" rel="noopener noreferrer" aria-label={`Reservar ${activeCabin.name}`}><CalendarDays size={17} />Reservar</a>
          <a className="button button--outline-map" href={activeCabin.detailsUrl} aria-label={`Ver detalles de ${activeCabin.name}`}>Ver detalles</a>
          <a className="map-google-link" href={activeCabin.googleMapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ir a Google Maps para ${activeCabin.name}`}>Ir a Google Maps <ExternalLink size={16} /></a>
        </div>
      </div>
    </div>
  </section>
}
