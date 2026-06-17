import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Story from './components/Story'
import Cabins from './components/Cabins'
import Experiences from './components/Experiences'
import Gallery from './components/Gallery'
import CabinMapExplorer from './components/CabinMapExplorer'
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
      <Testimonials />
      <Benefits />
      <Story />
      <Experiences />
      <Gallery />
      <CabinMapExplorer />
      <FAQ />
      <FinalCTA />
    </main>
    <Footer />
  </>
}
