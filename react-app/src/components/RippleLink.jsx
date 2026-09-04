import { useRef } from 'react';

export default function RippleLink({ href, className = '', children, ...rest }) {
  const ref = useRef(null);

  const handleClick = (e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const existing = el.querySelector('.ripple-dot');
    if (existing) existing.remove();

    const size = Math.max(rect.width, rect.height);
    const dot = document.createElement('span');
    dot.className = 'ripple-dot';
    dot.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      border-radius:50%;
      background:rgba(255,255,255,0.5);
      transform:scale(0);
      pointer-events:none;
      animation:ripple-effect 0.6s ease-out;
    `;
    el.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  };

  return (
    <a ref={ref} href={href} className={`ripple ${className}`.trim()} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
