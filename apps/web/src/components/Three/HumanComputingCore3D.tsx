import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  isSpeaking?: boolean;
  className?: string;
  size?: number;
}

export const HumanComputingCore3D: React.FC<Props> = ({ isSpeaking = false, className = '', size = 320 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isSpeakingRef = useRef(isSpeaking);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = size;
    const height = size;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Group to hold all 3D core elements
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Core Sphere (Icosahedron with wireframe)
    const sphereGeometry = new THREE.IcosahedronGeometry(1.3, 4);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x140206,
      emissive: 0x073b41,
      wireframe: true,
      wireframeLinewidth: 1.5,
      transparent: true,
      opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    coreGroup.add(coreMesh);

    // 2. Inner Glowing Core
    const innerGeometry = new THREE.IcosahedronGeometry(0.85, 2);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x1bd944,
      emissive: 0x1bd944,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerMesh);

    // 3. Surrounding Orbital Rings (Tavus Lilac and Pink)
    const ring1Geo = new THREE.TorusGeometry(1.8, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xff6183, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x1bd944, transparent: true, opacity: 0.8 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // 4. Floating Data Particles
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.9 + Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x140206,
      size: 0.04,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    coreGroup.add(particles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x1bd944, 2.5, 50);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    const pinkLight = new THREE.PointLight(0xff6183, 2, 50);
    pinkLight.position.set(-3, -3, -3);
    scene.add(pinkLight);

    // Mouse movement reactivity
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / height) * 2 - 1);
      targetRotationY = mouseX * 0.6;
      targetRotationX = -mouseY * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Base rotation
      coreMesh.rotation.y += 0.008;
      coreMesh.rotation.x += 0.004;

      innerMesh.rotation.y -= 0.012;

      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.008;

      particles.rotation.y += 0.003;

      // Mouse smooth interpolation
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      // Voice pulse reactivity
      const pulseSpeed = isSpeakingRef.current ? 8 : 2;
      const pulseScale = isSpeakingRef.current
        ? 1.0 + Math.sin(elapsedTime * pulseSpeed) * 0.12
        : 1.0 + Math.sin(elapsedTime * pulseSpeed) * 0.03;

      innerMesh.scale.set(pulseScale, pulseScale, pulseScale);
      innerMaterial.emissiveIntensity = isSpeakingRef.current ? 1.4 : 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <div ref={mountRef} style={{ width: size, height: size }} />
      {isSpeaking && (
        <div className="absolute bottom-2 px-3 py-1 bg-tavus-neon border border-tavus-black rounded-full text-[11px] font-mono font-bold text-tavus-black shadow-brutal-sm animate-bounce">
          ● VOICE STREAMING
        </div>
      )}
    </div>
  );
};
