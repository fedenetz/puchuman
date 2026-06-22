import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "../data";

export default function FAQ({ limit = FAQ_ITEMS.length }) {
  const [open, setOpen] = useState(0);
  const visibleItems = FAQ_ITEMS.slice(0, limit);

  return (
    <section className="faq section" id="preguntas">
      <div className="wrap faq__grid">
        <div>
          <p className="eyebrow">Antes de venir</p>
          <h2>
            Preguntas
            <br />
            frecuentes.
          </h2>
          <p>
            Lo esencial para que puedas planificar tu estadía con tranquilidad.
          </p>
        </div>
        <div className="accordion">
          {visibleItems.map(([question, answer], index) => (
            <div
              className={`accordion__item ${open === index ? "is-open" : ""}`}
              key={question}
            >
              <button
                id={`faq-button-${index}`}
                onClick={() => setOpen(open === index ? -1 : index)}
                aria-expanded={open === index}
                aria-controls={`faq-panel-${index}`}
              >
                <span>{question}</span>
                <Plus />
              </button>
              <div
                className="accordion__answer"
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-button-${index}`}
                hidden={open !== index}
              >
                <p>{answer}</p>
              </div>
            </div>
          ))}
          {limit < FAQ_ITEMS.length && (
            <a
              className="text-link faq__all-link"
              href="/politicas-de-reserva/"
            >
              Ver todas las políticas y preguntas
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
