import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Story from './components/Story'
import Cabins from './components/Cabins'
import Experiences from './components/Experiences'
import Gallery from './components/Gallery'
import Location from './components/Location'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

export default function App() {
  return <>
    <Header />
    <main>
      <Hero />
      <Cabins />
      <Benefits />
      <Story />
      <Experiences />
      <Gallery />
      <Location />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </main>
    <Footer />
  </>
}
