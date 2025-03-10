// src/components/ui/select.js
import React from 'react';

export const Select = ({ children, value, onValueChange, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const SelectContent = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const SelectItem = ({ children, value, ...props }) => {
  return <div {...props} data-value={value}>{children}</div>;
};

export const SelectTrigger = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

export const SelectValue = ({ placeholder, ...props }) => {
  return <span {...props}>{placeholder}</span>;
};
