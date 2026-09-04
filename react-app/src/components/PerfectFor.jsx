import Reveal from './Reveal';
import { perfectForEvents } from '../data/content';

export default function PerfectFor() {
  return (
    <section id="events" className="perfect-for section">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-tag">Perfect For</span>
          <h2>An Occasion for Every Celebration</h2>
        </Reveal>
        <div className="events-grid">
          {perfectForEvents.map((item) => (
            <Reveal key={item.title} className="event-card">
              <div className={`event-icon ${item.className}`}>
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
