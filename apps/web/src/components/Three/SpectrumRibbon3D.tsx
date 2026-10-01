import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  isActive?: boolean;
  className?: string;
  height?: number;
}

export const SpectrumRibbon3D: React.FC<Props> = ({
  isActive = false,
  className = '',
  height = 140
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Dynamic 3D Soundwave Ribbon Plane
    const segX = 64;
    const segY = 16;
    const ribbonGeo = new THREE.PlaneGeometry(6, 1.4, segX, segY);
    ribbonGeo.rotateX(-Math.PI / 3);

    // Custom gradient vertex colors
    const count = ribbonGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const colorNeon = new THREE.Color(0x1bd944);
    const colorPink = new THREE.Color(0xff6183);
    const colorGlow = new THREE.Color(0xffb835);

    for (let i = 0; i < count; i++) {
      const u = (ribbonGeo.attributes.position.getX(i) + 3) / 6;
      const c = u < 0.5 ? colorNeon.clone().lerp(colorPink, u * 2) : colorPink.clone().lerp(colorGlow, (u - 0.5) * 2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    ribbonGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const ribbonMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });

    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    scene.add(ribbonMesh);

    // Initial position copy for vertex displacement
    const posAttr = ribbonGeo.attributes.position;
    const originalY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      originalY[i] = posAttr.getY(i);
    }

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const active = isActiveRef.current;

      const freq = active ? 8.0 : 2.5;
      const amp = active ? 0.38 : 0.08;

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);

        // Sinusoidal traveling wave
        const wave = Math.sin(x * 2.2 + elapsed * freq) * Math.cos(z * 3.0 + elapsed * freq * 0.8) * amp;
        posAttr.setY(i, originalY[i] + wave);
      }
      posAttr.needsUpdate = true;

      ribbonMesh.rotation.z = Math.sin(elapsed * 0.5) * 0.04;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [height]);

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      <div ref={mountRef} className="w-full" style={{ height }} />
      <div className="absolute top-2 right-4 px-2.5 py-0.5 bg-[#140206] text-[#1bd944] border border-[#140206] rounded-full text-[10px] font-mono font-bold uppercase shadow-brutal-sm">
        {isActive ? '● 3D SPECTRUM DYNAMIC' : '○ IDLE CARRIER'}
      </div>
    </div>
  );
};
