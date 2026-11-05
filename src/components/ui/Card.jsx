const Card = ({ className = '', children, hover = false, ...props }) => {
  return (
    <div
      className={`rounded-3xl border border-border bg-card overflow-hidden transition-all duration-500 ${hover ? 'hover:-translate-y-1 hover:shadow-[0_18px_40px_-28px_rgba(18,20,22,0.35)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>{children}</div>
);

const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-2 ${className}`} {...props}>{children}</div>
);

const CardFooter = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-0 flex items-center ${className}`} {...props}>{children}</div>
);

export { Card, CardHeader, CardContent, CardFooter };
