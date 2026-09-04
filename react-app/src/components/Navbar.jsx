import { useState } from 'react';
import useScrollSpy from '../hooks/useScrollSpy';
import { navLinks } from '../data/content';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrolled, activeId } = useScrollSpy(navLinks.map((l) => l.id));

  const closeMenu = () => setMenuOpen(false);

  return (
    <header>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#home" className="nav-logo" onClick={closeMenu}>
            JP <span>TERRACE</span> LOUNGE
          </a>
          <button
            className={`nav-toggle${menuOpen ? ' active' : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`nav-menu${menuOpen ? ' active' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`nav-link${activeId === link.id ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#booking" className="nav-cta" onClick={closeMenu}>
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
