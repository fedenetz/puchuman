import Header from "./Header";
import Footer from "./Footer";
import MobileConversionBar from "./MobileConversionBar";

export default function PageLayout({ children }) {
  return (
    <>
      <Header />
      <main id="main-content" className="content-page" tabIndex="-1">
        {children}
      </main>
      <Footer />
      <MobileConversionBar />
    </>
  );
}
