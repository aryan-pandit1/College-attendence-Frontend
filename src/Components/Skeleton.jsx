// src/Components/Skeleton.jsx
import React from "react";
import "./Skeleton.css";

const Skeleton = ({ 
  width = "100%", 
  height = "20px", 
  borderRadius = "8px", 
  variant = "text", // "text", "rectangular", or "circular"
  style = {} 
}) => {
  
  const styles = {
    width,
    height,
    borderRadius: variant === "circular" ? "50%" : borderRadius,
    ...style
  };

  return <div className={`skeleton-loader variant-${variant}`} style={styles}></div>;
};

export default Skeleton;