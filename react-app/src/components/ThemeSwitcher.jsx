import { useEffect, useState } from 'react';
import { themes } from '../data/content';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState('gold');

  useEffect(() => {
    const saved = localStorage.getItem('jptl-theme');
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (theme && theme !== 'gold') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jptl-theme', theme);
  }, [theme]);

  return (
    <div className="theme-switcher">
      <i className="fa-solid fa-palette theme-switcher-icon" aria-hidden="true"></i>
      <div className="theme-options">
        {themes.map((t) => (
          <button
            key={t.id}
            className={`theme-dot${theme === t.id ? ' active' : ''}`}
            style={{ '--dot-color': t.color }}
            aria-label={t.label}
            onClick={() => setTheme(t.id)}
          />
        ))}
      </div>
    </div>
  );
}
