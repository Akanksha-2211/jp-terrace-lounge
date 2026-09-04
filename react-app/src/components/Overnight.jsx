import { useMemo } from 'react';
import Reveal from './Reveal';
import { overnightList } from '../data/content';

export default function Overnight() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
      })),
    []
  );

  return (
    <section className="overnight section">
      <div className="overnight-bg">
        <div className="stars">
          {stars.map((s, i) => (
            <span key={i} className="star" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
          ))}
        </div>
        <div className="moon">
          <i className="fa-solid fa-moon"></i>
        </div>
      </div>

      <Reveal className="container overnight-content">
        <span className="section-tag light">Beyond Midnight</span>
        <h2>Celebrate Beyond Midnight</h2>
        <p>Turn your celebration into an unforgettable overnight experience under the open sky.</p>

        <div className="overnight-grid">
          <ul className="overnight-list">
            {overnightList.map((item) => (
              <li key={item}>
                <i className="fa-solid fa-star"></i> {item}
              </li>
            ))}
          </ul>
          <div className="overnight-timing">
            <i className="fa-regular fa-clock"></i>
            <h3>10:00 PM – 6:00 AM</h3>
            <p>Advance Reservation Required</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
