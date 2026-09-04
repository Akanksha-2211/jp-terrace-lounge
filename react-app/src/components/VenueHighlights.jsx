import Reveal from './Reveal';
import { venueHighlights } from '../data/content';

export default function VenueHighlights() {
  return (
    <section id="venue" className="venue section">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-tag">Venue Highlights</span>
          <h2>Everything You Need for a Perfect Evening</h2>
        </Reveal>
        <div className="venue-grid">
          {venueHighlights.map((item) => (
            <Reveal key={item.title} className="venue-card">
              <div className="venue-icon">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
