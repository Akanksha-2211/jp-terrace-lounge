import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Gallery from '../components/Gallery';
import VenueHighlights from '../components/VenueHighlights';
import PerfectFor from '../components/PerfectFor';
import Overnight from '../components/Overnight';
import Timings from '../components/Timings';
import Booking from '../components/Booking';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <VenueHighlights />
        <PerfectFor />
        <Overnight />
        <Timings />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
