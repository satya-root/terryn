'use client';

import React, { useRef, useState } from 'react';

export default function GlowButton({ children, className, onClick, ...props }) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden ${className || ''}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(120px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.8), transparent 100%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
        {children}
      </span>
    </button>
  );
}
