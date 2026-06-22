import { CalendarCheck, Contact, FileCheck, Users } from "lucide-react";

const items = [
  [
    Users,
    "Capacidad clara",
    "Opciones publicadas para grupos de 4 a 8 personas.",
  ],
  [
    CalendarCheck,
    "Reserva online",
    "Disponibilidad y tarifa vigentes en el motor de reservas.",
  ],
  [
    FileCheck,
    "Políticas visibles",
    "Horarios, cancelaciones y normas disponibles antes de reservar.",
  ],
  [
    Contact,
    "Contacto directo",
    "WhatsApp, email e Instagram publicados en el sitio.",
  ],
];

export default function Benefits() {
  return (
    <section className="benefits wrap" aria-label="Información para reservar">
      {items.map(([Icon, title, text], index) => (
        <article key={title} className="benefit">
          <span className="benefit__number">0{index + 1}</span>
          <Icon />
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
