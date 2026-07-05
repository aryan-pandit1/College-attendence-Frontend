import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, variant = "rectangular", className = "" }) => {
  const style = {
    width: width || "100%",
    height: height || "100%",
    borderRadius: borderRadius || (variant === "circular" ? "50%" : "8px"),
  };

  return (
    <div 
      className={`skeleton-base ${variant === "circular" ? "skeleton-circle" : ""} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;