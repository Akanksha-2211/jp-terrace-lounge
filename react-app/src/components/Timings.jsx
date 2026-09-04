import Reveal from './Reveal';

export default function Timings() {
  return (
    <section id="timings" className="timings section">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-tag">Timings</span>
          <h2>When You Can Celebrate With Us</h2>
        </Reveal>
        <Reveal className="timeline">
          <div className="timeline-card">
            <div className="timeline-icon">
              <i className="fa-regular fa-clock"></i>
            </div>
            <h3>Regular Hours</h3>
            <div className="timeline-row">
              <span>Monday – Thursday</span>
              <strong>12:00 PM – 11:00 PM</strong>
            </div>
            <div className="timeline-row">
              <span>Friday – Sunday</span>
              <strong>12:00 PM – 12:00 AM</strong>
            </div>
          </div>
          <div className="timeline-card highlight">
            <div className="timeline-icon">
              <i className="fa-solid fa-moon"></i>
            </div>
            <h3>Overnight Bookings</h3>
            <div className="timeline-row">
              <span>Every Day</span>
              <strong>10:00 PM – 6:00 AM</strong>
            </div>
            <p className="timeline-note">
              <i className="fa-solid fa-circle-info"></i> Advance Reservation Required
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
