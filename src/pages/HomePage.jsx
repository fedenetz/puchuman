import Header from "../components/Header";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Story from "../components/Story";
import Cabins from "../components/Cabins";
import Experiences from "../components/Experiences";
import Gallery from "../components/Gallery";
import LazyCabinMapExplorer from "../components/LazyCabinMapExplorer";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import MobileConversionBar from "../components/MobileConversionBar";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <Cabins />
        <Benefits />
        <Story />
        <Experiences />
        <Gallery />
        <LazyCabinMapExplorer />
        <FAQ limit={5} />
        <FinalCTA />
      </main>
      <Footer />
      <MobileConversionBar />
    </>
  );
}
