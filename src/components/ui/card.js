// src/components/ui/card.js
import React from 'react';

export const Card = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h2 className={className} {...props}>
    {children}
  </h2>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardDescription = ({ children, className, ...props }) => (
  <p className={className} {...props}>
    {children}
  </p>
);
