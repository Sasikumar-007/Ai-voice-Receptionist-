import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  isActive?: boolean;
  onDial?: (digit: string) => void;
  className?: string;
  size?: number;
}

export const RetroPhoneHardware3D: React.FC<Props> = ({
  isActive = false,
  onDial,
  className = '',
  size = 380
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(isActive);
  const [lastDigit, setLastDigit] = useState<string | null>(null);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = size;
    const height = size;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // 1. BASE RETRO TERMINAL CHASSIS (Tavus Cream PC Plastic #d9d0c2 / #fbf8f1)
    const baseGeo = new THREE.BoxGeometry(2.4, 0.5, 2.2);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ef,
      roughness: 0.3,
      metalness: 0.05
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.25;
    phoneGroup.add(baseMesh);

    // Dark brutalist edge border base
    const trimGeo = new THREE.BoxGeometry(2.46, 0.1, 2.26);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x140206, roughness: 0.8 });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = -0.52;
    phoneGroup.add(trimMesh);

    // 2. SLANTED KEYPAD / DISPLAY CONSOLE
    const wedgeGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.3, 3, 1, false, 0, Math.PI);
    wedgeGeo.rotateZ(Math.PI / 2);
    wedgeGeo.scale(0.8, 0.4, 0.9);

    // CRT Oscilloscope Display Screen (Neon Phosphor)
    const screenGeo = new THREE.PlaneGeometry(1.8, 0.65);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x073b41,
      emissive: 0x1bd944,
      emissiveIntensity: isActive ? 0.8 : 0.25,
      roughness: 0.1
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.rotation.x = -Math.PI / 4;
    screenMesh.position.set(0, 0.2, -0.45);
    phoneGroup.add(screenMesh);

    // 3. KEYPAD BUTTONS (Interactive 3D Pushable Keys)
    const buttonGroup = new THREE.Group();
    phoneGroup.add(buttonGroup);

    const buttons: { mesh: THREE.Mesh; label: string; initialY: number }[] = [];
    const keyLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
    const buttonGeo = new THREE.BoxGeometry(0.24, 0.12, 0.24);
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x140206,
      roughness: 0.4,
      metalness: 0.2
    });

    keyLabels.forEach((label, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;

      const btn = new THREE.Mesh(buttonGeo, buttonMat.clone());
      const posX = (col - 1) * 0.38;
      const posZ = 0.15 + row * 0.32;
      const posY = 0.08;

      btn.position.set(posX, posY, posZ);
      btn.userData = { label };
      buttonGroup.add(btn);
      buttons.push({ mesh: btn, label, initialY: posY });
    });

    // 4. HANDSET CRADLE & 3D HANDSET RECEIVER
    const cradleGeo = new THREE.BoxGeometry(0.3, 0.15, 1.4);
    const cradleMat = new THREE.MeshStandardMaterial({ color: 0x5e5850, roughness: 0.5 });
    const cradleLeft = new THREE.Mesh(cradleGeo, cradleMat);
    cradleLeft.position.set(-1.0, 0.05, 0);
    phoneGroup.add(cradleLeft);

    // The 3D Handset Group
    const handsetGroup = new THREE.Group();
    phoneGroup.add(handsetGroup);
    handsetGroup.position.set(-1.0, 0.25, 0);

    const handsetBarGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.1, 16);
    const handsetMat = new THREE.MeshStandardMaterial({ color: 0x140206, roughness: 0.2, metalness: 0.4 });
    const handsetBar = new THREE.Mesh(handsetBarGeo, handsetMat);
    handsetBar.rotation.x = Math.PI / 2;
    handsetGroup.add(handsetBar);

    const earpieceGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.22, 16);
    const earpiece = new THREE.Mesh(earpieceGeo, handsetMat);
    earpiece.rotation.x = Math.PI / 2;
    earpiece.position.set(0, 0, -0.55);
    handsetGroup.add(earpiece);

    const mouthpieceGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.22, 16);
    const mouthpiece = new THREE.Mesh(mouthpieceGeo, handsetMat);
    mouthpiece.rotation.x = Math.PI / 2;
    mouthpiece.position.set(0, 0, 0.55);
    handsetGroup.add(mouthpiece);

    // 5. STATUS INDICATOR LEDS (Neon Green, Bubbletech Pink)
    const ledGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const ledGreenMat = new THREE.MeshStandardMaterial({
      color: 0x1bd944,
      emissive: 0x1bd944,
      emissiveIntensity: 1.0
    });
    const ledGreen = new THREE.Mesh(ledGeo, ledGreenMat);
    ledGreen.position.set(0.9, 0.1, -0.7);
    phoneGroup.add(ledGreen);

    const ledPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff6183,
      emissive: 0xff6183,
      emissiveIntensity: 0.8
    });
    const ledPink = new THREE.Mesh(ledGeo, ledPinkMat);
    ledPink.position.set(0.9, 0.1, -0.55);
    phoneGroup.add(ledPink);

    // 6. LIGHTING
    const topLight = new THREE.DirectionalLight(0xffffff, 2.0);
    topLight.position.set(2, 5, 3);
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0xf5f3ef, 0.8);
    scene.add(ambientLight);

    // RAYCASTING FOR INTERACTIVE 3D KEYPAD DIALING
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buttons.map((b) => b.mesh));

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const digit = hitMesh.userData.label;
        setLastDigit(digit);
        if (onDial) onDial(digit);

        // Tactile button depress animation
        hitMesh.position.y = 0.02;
        setTimeout(() => {
          hitMesh.position.y = 0.08;
        }, 120);
      }
    };

    mountRef.current.addEventListener('pointerdown', handlePointerDown);

    // MOUSE PARALLAX
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetRotY = x * 0.25;
      targetRotX = -y * 0.15;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Mouse smooth interpolation
      phoneGroup.rotation.y += (targetRotY - phoneGroup.rotation.y) * 0.06;
      phoneGroup.rotation.x += (targetRotX - phoneGroup.rotation.x) * 0.06;

      // Handset Pickup Motion when Call is Active
      if (isActiveRef.current) {
        const targetHandsetY = 0.75 + Math.sin(elapsed * 2) * 0.05;
        const targetHandsetRotZ = 0.35;
        const targetHandsetRotX = 0.2;

        handsetGroup.position.y += (targetHandsetY - handsetGroup.position.y) * 0.08;
        handsetGroup.position.x += (-0.6 - handsetGroup.position.x) * 0.08;
        handsetGroup.rotation.z += (targetHandsetRotZ - handsetGroup.rotation.z) * 0.08;
        handsetGroup.rotation.x += (targetHandsetRotX - handsetGroup.rotation.x) * 0.08;

        screenMat.emissiveIntensity = 0.9 + Math.sin(elapsed * 12) * 0.3;
        ledGreenMat.emissiveIntensity = 1.4 + Math.sin(elapsed * 8) * 0.6;
      } else {
        handsetGroup.position.y += (0.25 - handsetGroup.position.y) * 0.1;
        handsetGroup.position.x += (-1.0 - handsetGroup.position.x) * 0.1;
        handsetGroup.rotation.z += (0 - handsetGroup.rotation.z) * 0.1;
        handsetGroup.rotation.x += (0 - handsetGroup.rotation.x) * 0.1;

        screenMat.emissiveIntensity = 0.25;
        ledGreenMat.emissiveIntensity = 0.6;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current) {
        mountRef.current.removeEventListener('pointerdown', handlePointerDown);
        if (renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, [size, onDial]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <div ref={mountRef} style={{ width: size, height: size }} className="cursor-pointer" />

      {/* Retro Hardware Overlay Badge */}
      <div className="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-md border-2 border-[#140206] rounded-full text-[10px] font-mono font-bold text-[#140206] shadow-brutal-sm flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#1bd944]" />
        <span>3D TELEPHONY TERMINAL</span>
      </div>

      {lastDigit && (
        <div className="absolute bottom-2 px-3 py-1 bg-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono font-bold text-[#1bd944] shadow-brutal-sm animate-pulse">
          DTMF TONE: [{lastDigit}]
        </div>
      )}
    </div>
  );
};
