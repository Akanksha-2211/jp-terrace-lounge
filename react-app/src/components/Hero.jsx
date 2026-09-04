import { useMemo } from 'react';
import RippleLink from './RippleLink';

export default function Hero() {
  const particles = useMemo(() => {
    const count = window.innerWidth < 768 ? 18 : 32;
    return Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 2}px`,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * 10}s`,
    }));
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-bg" style={{ backgroundImage: "url('/images/jp-terrace-sunset.png')" }} />
      <div className="hero-overlay" />
      <div className="particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <p className="hero-logo reveal">JP TERRACE LOUNGE</p>
        <p className="hero-tagline reveal">Where Memories Meet the Sky</p>
        <h1 className="hero-heading reveal">Celebrate Life's Best Moments Above the City</h1>
        <p className="hero-desc reveal">
          Whether it's a birthday, office gathering, kitty party, family celebration, or a casual
          get-together, JP Terrace Lounge offers the perfect rooftop setting to create unforgettable
          memories.
        </p>
        <div className="hero-buttons reveal">
          <RippleLink href="#booking" className="btn btn-primary">Book Your Event</RippleLink>
          <RippleLink href="#contact" className="btn btn-secondary">Contact Us</RippleLink>
        </div>
      </div>

      <a href="#about" className="scroll-indicator" aria-label="Scroll down">
        <span></span>
      </a>
    </section>
  );
}
