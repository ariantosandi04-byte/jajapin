import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`flex h-11 w-full rounded-2xl border border-border bg-card px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
export { Input };
