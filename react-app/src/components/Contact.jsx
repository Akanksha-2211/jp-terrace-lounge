import Reveal from './Reveal';
import RippleLink from './RippleLink';

export default function Contact() {
  return (
    <section id="contact" className="contact section">
      <div className="container">
        <Reveal className="section-header">
          <span className="section-tag">Contact</span>
          <h2>Plan Your Celebration With Us</h2>
        </Reveal>

        <Reveal className="contact-card">
          <div className="contact-info">
            <div className="contact-item">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <h4>Address</h4>
                <p>JP Mindtree, Plot No. 51, Vittal Rao Nagar, Hitech City Road, near Melange Tower, HUDA Techno Enclave, Madhapur, Hyderabad, Telangana 500081</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fa-solid fa-phone"></i>
              <div>
                <h4>Phone</h4>
                <p>+91 XXXXX XXXXX</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>info@jpterracelounge.com</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fa-brands fa-whatsapp"></i>
              <div>
                <h4>WhatsApp</h4>
                <p>+91 XXXXX XXXXX</p>
              </div>
            </div>
          </div>

          <div className="contact-buttons">
            <RippleLink href="tel:+91XXXXXXXXXX" className="btn btn-primary">
              <i className="fa-solid fa-phone"></i> Call Now
            </RippleLink>
            <RippleLink
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <i className="fa-brands fa-whatsapp"></i> WhatsApp
            </RippleLink>
            <RippleLink
              href="https://maps.google.com/?q=JP+Mindtree+Plot+No+51+Vittal+Rao+Nagar+Hitech+City+Road+HUDA+Techno+Enclave+Madhapur+Hyderabad+Telangana+500081"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <i className="fa-solid fa-map-location-dot"></i> Get Directions
            </RippleLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
