import React, { useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
}

export const TiltCard3D: React.FC<Props> = ({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1000,
  scale = 1.015,
  glare = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    const percentX = (x / width) * 2 - 1;
    const percentY = (y / height) * 2 - 1;

    const rotateX = -percentY * maxTilt;
    const rotateY = percentX * maxTilt;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      setGlarePosition({
        x: (x / width) * 100,
        y: (y / height) * 100,
        opacity: 0.22
      });
    }
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    if (glare) {
      setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.4, 1)'
      }}
      className={`relative will-change-transform ${className}`}
    >
      {/* Glare Sheen Reflection */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)`,
            opacity: glarePosition.opacity
          }}
        />
      )}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
};
