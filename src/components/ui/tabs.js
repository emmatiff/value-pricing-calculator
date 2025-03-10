// src/components/ui/tabs.js
import React from 'react';

export const Tabs = ({ children, value, onValueChange, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const TabsContent = ({ children, value, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const TabsList = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const TabsTrigger = ({ children, value, className, ...props }) => (
  <button className={className} {...props}>
    {children}
  </button>
);
