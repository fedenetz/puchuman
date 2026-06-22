import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { BOOKING_URL, BUSINESS } from "../data";
import TrackedLink from "./TrackedLink";

const links = [
  ["Cabañas", "/cabanas/"],
  ["Experiencias", "/#experiencias"],
  ["Galería", "/#galeria"],
  ["Ubicación", "/#ubicacion"],
  ["Preguntas", "/#preguntas"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const menuButtonRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const background = document.querySelectorAll(
      "main, .footer, .mobile-conversion",
    );
    background.forEach((element) => {
      element.toggleAttribute("inert", open);
    });

    if (open) {
      const firstLink = navRef.current?.querySelector("a[href]");
      firstLink?.focus();
    }

    const onKeyDown = (event) => {
      if (!open) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [
        menuButtonRef.current,
        ...(navRef.current?.querySelectorAll("a[href]") ?? []),
      ].filter(Boolean);
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      background.forEach((element) => {
        element.removeAttribute("inert");
      });
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className={`header ${solid ? "header--solid" : ""}`}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <a
        href="/"
        className="brand"
        aria-label={`${BUSINESS.publicName}, inicio`}
      >
        <img
          src="/media/brand/logo-mark-96.webp"
          alt=""
          width="96"
          height="96"
        />
        <span>
          <b>PUCHUMAN</b>
          <small>CABAÑAS · LICAN RAY</small>
        </span>
      </a>
      <button
        ref={menuButtonRef}
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="primary-navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        ref={navRef}
        id="primary-navigation"
        className={open ? "nav nav--open" : "nav"}
        aria-label="Navegación principal"
      >
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <TrackedLink
          className="button button--small"
          href={BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          eventName="begin_booking"
          analyticsParams={{ cta_location: "header" }}
          onClick={() => setOpen(false)}
        >
          Reservar
        </TrackedLink>
      </nav>
    </header>
  );
}
