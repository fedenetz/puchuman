const env = import.meta.env ?? {};

export const BUSINESS = {
  publicName: "Cabañas Puchuman Lican Ray",
  legalName: "Catriñir SPA",
  canonicalOrigin: "https://puchuman.cl",
};

export const CONTACT = {
  whatsapp: "56956003883",
  whatsappDisplay: "+56 9 5600 3883",
  callsAccepted: false,
  instagram: "puchuman.licanray",
  email: "puchuman.licanray@gmail.com",
  privacyEmail: "puchuman.licanray@gmail.com",
  address: "Lican Ray, Región de La Araucanía",
};

const DEFAULT_BOOKING_URL =
  "https://reservation.gofeels.com/es/reservation/?token=bef9fc92-6d8b-4419-b2c0-5906783f8871&rooms";

// This is public client-side configuration, not a private credential.
export const BOOKING_URL =
  env.VITE_GOFEELS_BOOKING_URL?.trim() || DEFAULT_BOOKING_URL;

const responsiveImage = ({ base, widths, width, height, alt, social }) => ({
  src: `/media/${base}-${widths.at(-1)}.jpg`,
  alt,
  width,
  height,
  sources: {
    avif: widths
      .map((size) => `/media/${base}-${size}.avif ${size}w`)
      .join(", "),
    webp: widths
      .map((size) => `/media/${base}-${size}.webp ${size}w`)
      .join(", "),
    jpeg: widths
      .map((size) => `/media/${base}-${size}.jpg ${size}w`)
      .join(", "),
  },
  social: social ? `/media/social/${social}-1200x630.jpg` : undefined,
});

export const HERO_IMAGE = responsiveImage({
  base: "hero/puchuman-hero",
  widths: [640, 1280, 1920],
  width: 1920,
  height: 1080,
  alt: "Lago Calafquén y muelle de Playa Grande en Lican Ray",
  social: "puchuman",
});

export const STORY_IMAGE = responsiveImage({
  base: "story/playa-peninsula",
  widths: [480, 800, 1280],
  width: 1280,
  height: 720,
  alt: "Vista del lago Calafquén desde la península",
});

export const FINAL_CTA_IMAGE = responsiveImage({
  base: "cta/atardecer-lago",
  widths: [640, 1280, 1920],
  width: 1920,
  height: 1081,
  alt: "",
});

export const CABINS = [
  {
    id: "rafael-mera",
    slug: "casa-rafael-mera",
    displayOrder: 1,
    name: "Casa Rafael Mera",
    type: "Casa familiar",
    units: 1,
    addressCopy: "calle Rafael Mera #630",
    locationCopy:
      "a una cuadra de Playa Grande y cuatro cuadras de Playa Chica",
    goFeelsRoomId: 4056,
    capacity: { guests: 8, label: "8 personas" },
    bedrooms: { count: 3, label: "3 habitaciones" },
    bathrooms: { count: 3, label: "3 baños" },
    shortDescription:
      "Casa equipada para 8 personas, con 3 habitaciones y 3 baños.",
    longDescription:
      "Casa familiar equipada para 8 personas, con 3 habitaciones y 3 baños.",
    amenities: [
      "Cocina equipada",
      "3 habitaciones y 3 baños",
      "Parrilla para asados",
      "Smart TV con WiFi",
    ],
    mapHighlights: ["Cocina equipada", "Parrilla para asados"],
    image: responsiveImage({
      base: "cabins/casa-rafael-mera",
      widths: [480, 800, 1024],
      alt: "Casa Rafael Mera, Casa familiar",
      width: 1024,
      height: 768,
      social: "casa-rafael-mera",
    }),
    coordinates: { lat: -39.489361, lng: -72.160417 },
    googleMapsUrl: "https://maps.app.goo.gl/AnXJSM8o9NBi6vDGA",
    bookingUrl: "https://reservation.gofeels.com/es/room-detail/4056?CLP",
    futureDetailUrl: "/cabanas/casa-rafael-mera/",
  },
  {
    id: "colinanco",
    slug: "casa-colinanco",
    displayOrder: 2,
    name: "Casa Coliñanco",
    type: "Casa familiar",
    units: 1,
    addressCopy: "calle Cacique Coliñanco #15",
    locationCopy: "a una cuadra de Playa Grande",
    goFeelsRoomId: 4140,
    capacity: { guests: 8, label: "8 personas" },
    bedrooms: { count: 4, label: "4 habitaciones" },
    bathrooms: { count: 2, label: "2 baños" },
    shortDescription:
      "Casa equipada para 8 personas, con 4 habitaciones y 2 baños.",
    longDescription:
      "Casa familiar equipada para 8 personas, con 4 habitaciones y 2 baños.",
    amenities: [
      "WiFi",
      "Aire acondicionado",
      "Smart TV con WiFi",
      "Estacionamiento",
      "Cocina completa",
      "Patio privado",
    ],
    mapHighlights: ["Cocina completa", "Patio privado"],
    image: responsiveImage({
      base: "cabins/casa-colinanco",
      widths: [480, 800, 1024],
      alt: "Casa Coliñanco, Casa familiar",
      width: 1024,
      height: 1024,
      social: "casa-colinanco",
    }),
    coordinates: { lat: -39.489917, lng: -72.159944 },
    googleMapsUrl: "https://maps.app.goo.gl/KevJ6umWZLkmsj7J6",
    bookingUrl: "https://reservation.gofeels.com/es/room-detail/4140?CLP",
    futureDetailUrl: "/cabanas/casa-colinanco/",
  },
  {
    id: "mariposa",
    slug: "cabana-mariposa",
    displayOrder: 3,
    name: "Cabañas Mariposa",
    type: "4 unidades disponibles",
    units: 4,
    addressCopy: "calle Cacique Coliñanco #15",
    locationCopy:
      "a una cuadra de Playa Grande y cuatro cuadras de Playa Chica",
    goFeelsRoomId: 4058,
    capacity: { guests: 4, label: "4 personas" },
    bedrooms: { count: 2, label: "2 dormitorios" },
    bathrooms: { count: 1, label: "1 baño" },
    shortDescription:
      "Cuatro cabañas equipadas para grupos de hasta 4 personas.",
    longDescription:
      "Cabañas equipadas para 4 personas, con 2 dormitorios y 1 baño. Hay 4 unidades disponibles.",
    amenities: [
      "Cama matrimonial + 2 individuales",
      "Estacionamiento",
      "Parrilla para asados",
      "Cocina equipada",
    ],
    mapHighlights: ["Estacionamiento", "Parrilla para asados"],
    image: responsiveImage({
      base: "cabins/cabana-mariposa",
      widths: [480, 800, 1024],
      alt: "Cabañas Mariposa, 4 unidades disponibles",
      width: 1024,
      height: 1024,
      social: "cabana-mariposa",
    }),
    coordinates: { lat: -39.489917, lng: -72.159944 },
    googleMapsUrl: "https://maps.app.goo.gl/A9WdhKc3TuoarEur8",
    bookingUrl: "https://reservation.gofeels.com/es/room-detail/4058?CLP",
    futureDetailUrl: "/cabanas/cabana-mariposa/",
  },
  {
    id: "cariman",
    slug: "casa-cariman",
    displayOrder: 4,
    name: "Casa Cariman",
    type: "Casa familiar",
    units: 1,
    addressCopy: "calle Cacique Cariman #320",
    locationCopy:
      "a una cuadra de Playa Chica y cuatro cuadras de Playa Grande",
    goFeelsRoomId: 4430,
    capacity: { guests: 6, label: "6 personas" },
    bedrooms: { count: 3, label: "3 habitaciones" },
    bathrooms: { count: 1, label: "1 baño" },
    shortDescription:
      "Casa equipada para 6 personas, con 3 habitaciones y 1 baño.",
    longDescription:
      "Casa familiar para 6 personas, con 3 habitaciones, 1 baño y estacionamiento.",
    amenities: [
      "Cama matrimonial",
      "4 camas individuales",
      "3 habitaciones y 1 baño",
      "Cocina equipada",
      "Parrilla/asado techado",
      "Estacionamiento",
      "WiFi",
      "Smart TV",
    ],
    mapHighlights: ["Estacionamiento", "Parrilla techada"],
    image: responsiveImage({
      base: "cabins/casa-cariman",
      widths: [480, 800, 1024],
      alt: "Casa Cariman, Casa familiar",
      width: 1024,
      height: 1024,
      social: "casa-cariman",
    }),
    coordinates: { lat: -39.489667, lng: -72.150944 },
    googleMapsUrl: "https://maps.app.goo.gl/LikxWopHp5w5ZjNs9",
    bookingUrl: "https://reservation.gofeels.com/es/room-detail/4430?CLP",
    futureDetailUrl: "/cabanas/casa-cariman/",
  },
  {
    id: "cariman-interior",
    slug: "casa-cariman-interior",
    displayOrder: 5,
    name: "Casa Cariman Interior",
    type: "Casa familiar",
    units: 1,
    addressCopy: "calle Cacique Cariman #320",
    locationCopy:
      "a una cuadra de Playa Chica y cuatro cuadras de Playa Grande",
    goFeelsRoomId: 4431,
    capacity: { guests: 5, label: "5 personas" },
    bedrooms: { count: 3, label: "3 habitaciones" },
    bathrooms: { count: 1, label: "1 baño" },
    shortDescription:
      "Casa equipada para 5 personas, con 3 habitaciones y 1 baño.",
    longDescription:
      "Casa para 5 personas, con 3 habitaciones, 1 baño y cocina equipada.",
    amenities: [
      "Cama matrimonial",
      "3 camas individuales",
      "Parrilla para asados",
      "Estacionamiento",
      "Cocina completa",
    ],
    mapHighlights: ["Estacionamiento", "Cocina completa"],
    image: responsiveImage({
      base: "cabins/casa-cariman-interior",
      widths: [480, 800, 1024],
      alt: "Casa Cariman Interior, Casa familiar",
      width: 1024,
      height: 1024,
      social: "casa-cariman-interior",
    }),
    coordinates: { lat: -39.489667, lng: -72.150944 },
    googleMapsUrl: "https://maps.app.goo.gl/LikxWopHp5w5ZjNs9",
    bookingUrl: "https://reservation.gofeels.com/es/room-detail/4431?CLP",
    futureDetailUrl: "/cabanas/casa-cariman-interior/",
  },
];

export const GALLERY = [
  ["atardecer-lago-calafquen", "Atardecer en el lago Calafquén", 960, 541],
  ["muelle-playa-grande", "Muelle de Playa Grande", 960, 541],
  ["peninsula", "Península de Lican Ray", 960, 540],
  ["playa-chica", "Playa Chica", 960, 540],
  ["senderos-peninsula", "Senderos de la península", 960, 1280],
  ["paseos-lago", "Paseos por el lago", 960, 541],
].map(([slug, alt, width, height]) =>
  responsiveImage({
    base: `gallery/${slug}`,
    widths: [480, 768, 960],
    alt,
    width,
    height,
  }),
);

export const FAQ_ITEMS = [
  [
    "¿Qué incluye la estadía?",
    "Una casa o cabaña familiar completamente equipada, estacionamiento y acceso a quincho con parrilla para asados. Las ubicaciones están a una cuadra de Playa Grande o Playa Chica, según el alojamiento.",
  ],
  [
    "¿Cuáles son los horarios de check-in y check-out?",
    "El check-in es desde las 15:00 y el check-out hasta las 11:00. Las llegadas después de las 19:00 deben coordinarse con Administración.",
  ],
  [
    "¿Cómo se calcula la cantidad de huéspedes?",
    "Las tarifas son por noche y según la cantidad de pasajeros. Toda persona mayor de 3 años cuenta como huésped pagado. Cada huésped adicional no declarado tiene un recargo de $10.000 CLP sobre la tarifa base aplicable.",
  ],
  [
    "¿Cuál es la política de cancelación?",
    "La cancelación es gratuita hasta 15 días antes de la fecha original de la reserva. En devoluciones de pagos con tarjeta de débito o crédito se retiene un 5% por cargo de servicio.",
  ],
  [
    "¿Puedo cambiar la fecha de mi reserva?",
    `Sí. Puedes solicitar un cambio hasta 7 días antes de la fecha original escribiendo a ${CONTACT.email}.`,
  ],
  [
    "¿Aceptan mascotas?",
    "Solo con autorización expresa de Administración. El responsable debe traer comederos, cobertores y cama, limpiar todos los desechos con sus propias bolsas y mantener a la mascota con correa fuera de la cabaña. La garantía equivale a una noche adicional. Los daños o suciedad pueden generar una multa según su magnitud.",
  ],
  [
    "¿Se puede fumar dentro de las casas o cabañas?",
    "No se permite fumar dentro de las cabañas o casas. El incumplimiento tiene una multa de 0,5 UF.",
  ],
  [
    "¿Qué normas de convivencia debo considerar?",
    "No se permiten ruidos ni conductas que alteren el orden o descanso. Administración puede solicitar la salida inmediata, sin devolución, a quienes incumplan. Desde la entrega de la llave, el huésped responde por daños o pérdidas según el inventario de la cabaña.",
  ],
  [
    "¿Puedo usar calefactores eléctricos?",
    "La electricidad es de 220 voltios. No se permiten calefactores eléctricos sin autorización de Administración; su uso autorizado cuesta $6.000 CLP por día.",
  ],
  [
    "¿Cómo puedo reservar?",
    "Puedes revisar disponibilidad y reservar en el motor de reservas. Para consultas, cancelaciones, cambios, reclamos o sugerencias escribe por WhatsApp o a puchuman.licanray@gmail.com; no se reciben llamadas.",
  ],
];

export const POLICY_SECTIONS = [
  {
    title: "Horarios y tarifas",
    paragraphs: [
      "El check-in es desde las 15:00 y el check-out hasta las 11:00. Toda llegada después de las 19:00 debe coordinarse con Administración.",
      "Las tarifas son por noche y dependen de la cantidad de pasajeros. Toda persona mayor de 3 años cuenta como huésped pagado. Cada huésped adicional no declarado tiene un recargo de $10.000 CLP sobre la tarifa base aplicable.",
    ],
  },
  {
    title: "Cancelaciones y cambios",
    paragraphs: [
      `La cancelación es gratuita hasta 15 días antes de la fecha original de la reserva. Los cambios de fecha se permiten hasta 7 días antes de esa fecha. Las solicitudes deben enviarse a ${CONTACT.email}.`,
      "En devoluciones de pagos con tarjeta de débito o crédito se retiene un 5% por cargo de servicio.",
    ],
  },
  {
    title: "Cuidado, convivencia y responsabilidad",
    paragraphs: [
      "Desde la entrega de la llave, el huésped es responsable por los daños o pérdidas. Todo daño o pérdida se cobra de acuerdo con el inventario de la cabaña.",
      "No se permiten ruidos ni conductas que alteren el orden o descanso de otras personas. Administración puede solicitar la salida inmediata, sin devolución, a quienes incumplan esta regla.",
      "Los padres y adultos son responsables de los niños dentro y fuera de las cabañas. Cada huésped es responsable de sus pertenencias personales; Cabañas Puchuman Lican Ray no responde por robos, pérdidas o artículos extraviados.",
      "Dentro de la propiedad se debe conducir y circular con cuidado.",
    ],
  },
  {
    title: "Electricidad y calefactores",
    paragraphs: [
      "La electricidad es de 220 voltios. No se permiten calefactores eléctricos sin autorización de Administración. El uso autorizado cuesta $6.000 CLP por día.",
    ],
  },
  {
    title: "Mascotas",
    paragraphs: [
      "Las mascotas se admiten solo con autorización expresa de Administración. Su responsable debe traer comederos, cobertores y cama, limpiar todos los desechos dentro y fuera de la cabaña usando sus propias bolsas, y mantener a la mascota con correa fuera de la unidad.",
      "La garantía por mascota equivale a una noche adicional. Los daños o suciedad pueden generar una multa según su magnitud. Cabañas Puchuman Lican Ray no es responsable por la seguridad, salud o accidentes de las mascotas.",
    ],
  },
  {
    title: "Prohibición de fumar",
    paragraphs: [
      "No se permite fumar dentro de las cabañas o casas. El incumplimiento tiene una multa de 0,5 UF.",
    ],
  },
  {
    title: "Contacto y aceptación",
    paragraphs: [
      `Para cancelaciones, cambios, reclamos o sugerencias escribe a ${CONTACT.email}. Al reservar o utilizar la propiedad, los huéspedes declaran conocer y aceptar estas normas.`,
    ],
  },
];

export const STAY_FACTS = {
  checkIn: "Desde las 15:00 hrs",
  checkOut: "Hasta las 11:00 hrs",
  availability:
    "Las tarifas son por noche y según la cantidad de pasajeros. Consulta la disponibilidad y el valor aplicable a tus fechas en el motor de reservas.",
  pets: "Se aceptan mascotas únicamente con autorización previa de la administración y se solicita una garantía equivalente a una noche adicional.",
  smoking: "No está permitido fumar dentro de las casas o cabañas.",
  clarification: `Para consultas antes de reservar, escribe por WhatsApp o a ${CONTACT.email}. No se reciben llamadas.`,
};
