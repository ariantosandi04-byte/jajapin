const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-muted ${className}`}
      {...props}
    />
  );
};

export { Skeleton };
