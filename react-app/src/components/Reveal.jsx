import useReveal from '../hooks/useReveal';

const VARIANT_CLASS = {
  up: 'fade-in',
  left: 'fade-in-left',
  right: 'fade-in-right',
};

export default function Reveal({ as: Tag = 'div', variant = 'up', className = '', children, ...rest }) {
  const [ref, visible] = useReveal();
  const classes = [VARIANT_CLASS[variant], visible ? 'visible' : '', className].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}
