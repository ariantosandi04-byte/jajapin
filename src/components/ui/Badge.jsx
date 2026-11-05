const variants = {
  default: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary text-foreground',
  accent: 'bg-accent/10 text-accent',
  lime: 'bg-brand-lime/15 text-brand-forest',
  outline: 'border border-border text-foreground',
  status: '',
};

const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-body font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
