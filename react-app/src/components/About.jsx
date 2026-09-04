import Reveal from './Reveal';

export default function About() {
  return (
    <section id="about" className="about section">
      <div className="container about-grid">
        <Reveal variant="left" className="about-image">
          <img
            src="/images/jp-terrace-night.png"
            alt="JP Terrace Lounge dining terrace illuminated at night"
            loading="lazy"
          />
          <div className="about-image-badge">
            <i className="fa-solid fa-star"></i>
            <span>Premium Rooftop Experience</span>
          </div>
        </Reveal>

        <Reveal variant="right" className="about-content">
          <span className="section-tag">About Us</span>
          <h2>About JP Terrace Lounge</h2>
          <p>
            Nestled in the heart of Mindspace, JP Terrace Lounge is a rooftop venue designed for
            intimate celebrations and memorable gatherings. With elegant ambience, open skies,
            comfortable seating, and a relaxed atmosphere, it's the perfect destination for hosting
            your special occasions.
          </p>
          <div className="about-stats">
            <div className="stat">
              <h3>50+</h3>
              <p>Guest Capacity</p>
            </div>
            <div className="stat">
              <h3>24/7</h3>
              <p>Booking Flexibility</p>
            </div>
            <div className="stat">
              <h3>360°</h3>
              <p>Sky Views</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
