import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ className = '', label, options = [], placeholder = 'Pilih...', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] uppercase tracking-[0.2em] font-body font-semibold text-muted-foreground mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`flex h-11 w-full appearance-none rounded-2xl border border-border bg-card px-4 py-2 pr-10 font-body text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-300 ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
});
Select.displayName = 'Select';
export { Select };
