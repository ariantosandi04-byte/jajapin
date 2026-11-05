import { forwardRef } from 'react';

const variants = {
  default: 'bg-primary text-primary-foreground hover:opacity-90',
  secondary: 'bg-secondary text-foreground hover:bg-secondary/80',
  outline: 'border border-border bg-transparent hover:bg-secondary',
  ghost: 'hover:bg-secondary',
  link: 'text-primary underline-offset-4 hover:underline',
  accent: 'bg-accent text-white hover:opacity-90',
  lime: 'bg-brand-lime text-brand-forest-deep hover:opacity-90 font-semibold',
};

const sizes = {
  default: 'h-11 px-6 py-2',
  sm: 'h-9 px-4 text-sm',
  lg: 'h-12 px-8 text-base',
  icon: 'h-10 w-10',
};

const Button = forwardRef(({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-full font-body font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';
export { Button };
