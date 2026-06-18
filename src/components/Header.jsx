import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BOOKING_URL } from '../data'

const links = [['Cabañas', '#cabanas'], ['Experiencias', '#experiencias'], ['Galería', '#galeria'], ['Ubicación', '#ubicacion'], ['Preguntas', '#preguntas']]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll(); window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  return <header className={`header ${solid ? 'header--solid' : ''}`}>
    <a href="#inicio" className="brand" aria-label="Puchuman Cabañas, inicio">
      <img src="/logo/logocabaassinfondo/4.png" alt="" /><span><b>PUCHUMAN</b><small>CABAÑAS · LICAN RAY</small></span>
    </a>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'nav nav--open' : 'nav'} aria-label="Navegación principal">
      {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="button button--small" href={BOOKING_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Reservar</a>
    </nav>
  </header>
}
