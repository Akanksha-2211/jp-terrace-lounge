import Reveal from './Reveal';
import { galleryImages } from '../data/content';

export default function Gallery() {
  return (
    <section id="gallery" className="gallery section">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-tag">Terrace Gallery</span>
          <h2>A Beautiful Setting for Every Celebration</h2>
        </Reveal>
        <div className="gallery-grid">
          {galleryImages.map((img) => (
            <Reveal as="figure" key={img.src} className="gallery-card">
              <img src={img.src} alt={img.alt} loading="lazy" />
              <figcaption>{img.caption}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
