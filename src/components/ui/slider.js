// src/components/ui/slider.js
import React from 'react';

export const Slider = ({ defaultValue, max, step, value, onValueChange, ...props }) => {
  const handleChange = (e) => {
    onValueChange([Number(e.target.value)]);
  };

  return (
    <input
      type="range"
      defaultValue={defaultValue[0]}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      {...props}
    />
  );
};
