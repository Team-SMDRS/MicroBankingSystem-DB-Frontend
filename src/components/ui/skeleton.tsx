
import React from 'react';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

export default Skeleton;