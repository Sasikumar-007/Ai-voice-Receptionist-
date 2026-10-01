import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  isSpeaking?: boolean;
  className?: string;
  size?: number;
  interactive?: boolean;
  showHUD?: boolean;
}

export const TavusHumanAvatar3D: React.FC<Props> = ({
  isSpeaking = false,
  className = '',
  size = 420,
  interactive = true,
  showHUD = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isSpeakingRef = useRef(isSpeaking);
  const [fps, setFps] = useState(60);
  const [latency] = useState(240);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = size;
    const height = size;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Root Group for the 3D Human Avatar
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // 1. HEAD BASE MESH (Stylized Human Head Geometry)
    const headGroup = new THREE.Group();
    avatarGroup.add(headGroup);

    // Cranium / Face Oval
    const headGeo = new THREE.SphereGeometry(1.05, 32, 32);
    headGeo.scale(0.85, 1.15, 0.95);

    // Head Material: Tactile Porcelain / Silicon with subtle wireframe matrix
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ef,
      roughness: 0.35,
      metalness: 0.15,
      flatShading: false
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 0.1;
    headGroup.add(headMesh);

    // Head Holographic Wireframe Cage (Gaussian Splat / CVI mesh)
    const wireGeo = new THREE.SphereGeometry(1.08, 20, 20);
    wireGeo.scale(0.86, 1.16, 0.96);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x140206,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.y = 0.1;
    headGroup.add(wireMesh);

    // 2. EYES & GAZE SYSTEM
    const eyeGroup = new THREE.Group();
    headGroup.add(eyeGroup);

    const eyeGeo = new THREE.SphereGeometry(0.13, 24, 24);
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x1bd944, roughness: 0.2, emissive: 0x073b41 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x140206 });

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    leftEye.position.set(-0.32, 0.22, 0.82);
    eyeGroup.add(leftEye);

    const leftIris = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 16), irisMat);
    leftIris.rotation.x = Math.PI / 2;
    leftIris.position.set(0, 0, 0.12);
    leftEye.add(leftIris);

    const leftPupil = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.022, 16), pupilMat);
    leftPupil.rotation.x = Math.PI / 2;
    leftPupil.position.set(0, 0, 0.125);
    leftEye.add(leftPupil);

    // Right Eye
    const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    rightEye.position.set(0.32, 0.22, 0.82);
    eyeGroup.add(rightEye);

    const rightIris = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 16), irisMat);
    rightIris.rotation.x = Math.PI / 2;
    rightIris.position.set(0, 0, 0.12);
    rightEye.add(rightIris);

    const rightPupil = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.022, 16), pupilMat);
    rightPupil.rotation.x = Math.PI / 2;
    rightPupil.position.set(0, 0, 0.125);
    rightEye.add(rightPupil);

    // Eyelids (Blinking mechanism)
    const eyelidGeo = new THREE.SphereGeometry(0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const eyelidMat = new THREE.MeshStandardMaterial({ color: 0xf3eee7, roughness: 0.4 });

    const leftUpperLid = new THREE.Mesh(eyelidGeo, eyelidMat);
    leftUpperLid.rotation.x = 0;
    leftUpperLid.position.copy(leftEye.position);
    headGroup.add(leftUpperLid);

    const rightUpperLid = new THREE.Mesh(eyelidGeo, eyelidMat);
    rightUpperLid.rotation.x = 0;
    rightUpperLid.position.copy(rightEye.position);
    headGroup.add(rightUpperLid);

    // 3. NOSE BRIDGE
    const noseGeo = new THREE.ConeGeometry(0.09, 0.32, 12);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ef, roughness: 0.4 });
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.rotation.x = Math.PI / 8;
    noseMesh.position.set(0, 0.05, 0.95);
    headGroup.add(noseMesh);

    // 4. JAW & MOUTH VISUALIZER (Speaking articulation)
    const jawGroup = new THREE.Group();
    headGroup.add(jawGroup);
    jawGroup.position.set(0, -0.3, 0.65);

    const upperLipGeo = new THREE.TorusGeometry(0.18, 0.025, 8, 24, Math.PI * 0.8);
    const lipMat = new THREE.MeshStandardMaterial({ color: 0xff6183, roughness: 0.3 });
    const upperLip = new THREE.Mesh(upperLipGeo, lipMat);
    upperLip.rotation.z = Math.PI * 0.1;
    upperLip.position.set(0, 0.05, 0.22);
    jawGroup.add(upperLip);

    const lowerLip = new THREE.Mesh(upperLipGeo, lipMat);
    lowerLip.rotation.z = -Math.PI * 0.9;
    lowerLip.position.set(0, -0.05, 0.22);
    jawGroup.add(lowerLip);

    // Interior mouth cavity (glows during speech)
    const mouthCavityGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16);
    const mouthCavityMat = new THREE.MeshStandardMaterial({
      color: 0x140206,
      emissive: 0x1bd944,
      emissiveIntensity: 0.1
    });
    const mouthCavity = new THREE.Mesh(mouthCavityGeo, mouthCavityMat);
    mouthCavity.rotation.x = Math.PI / 2;
    mouthCavity.position.set(0, 0, 0.18);
    jawGroup.add(mouthCavity);

    // 5. CHEEKBONES & EAR ACCENTS (Retro-Futuristic Human Computing Elements)
    const earGeo = new THREE.TorusGeometry(0.18, 0.04, 8, 24);
    const earMat = new THREE.MeshStandardMaterial({ color: 0x140206, roughness: 0.2, metalness: 0.8 });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.85, 0.15, 0);
    leftEar.rotation.y = Math.PI / 2;
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.85, 0.15, 0);
    rightEar.rotation.y = Math.PI / 2;
    headGroup.add(rightEar);

    // 6. VOLUMETRIC GAUSSIAN SPLATTING PARTICLES (Tavus 3D Splat aura)
    const splatCount = 350;
    const splatGeo = new THREE.BufferGeometry();
    const splatPositions = new Float32Array(splatCount * 3);
    const splatColors = new Float32Array(splatCount * 3);

    const colorNeon = new THREE.Color(0x1bd944);
    const colorPink = new THREE.Color(0xff6183);
    const colorGlow = new THREE.Color(0xffb835);

    for (let i = 0; i < splatCount * 3; i += 3) {
      const radius = 1.3 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      splatPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      splatPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) + 0.1;
      splatPositions[i + 2] = radius * Math.cos(phi);

      const pick = Math.random();
      const c = pick < 0.4 ? colorNeon : pick < 0.7 ? colorPink : colorGlow;
      splatColors[i] = c.r;
      splatColors[i + 1] = c.g;
      splatColors[i + 2] = c.b;
    }

    splatGeo.setAttribute('position', new THREE.BufferAttribute(splatPositions, 3));
    splatGeo.setAttribute('color', new THREE.BufferAttribute(splatColors, 3));

    const splatMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });
    const splatCloud = new THREE.Points(splatGeo, splatMat);
    avatarGroup.add(splatCloud);

    // 7. ORBITAL NEURAL RINGS
    const ringGeo = new THREE.TorusGeometry(1.6, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x140206, transparent: true, opacity: 0.35 });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 3;
    avatarGroup.add(orbitRing);

    // 8. LIGHTING SETUP (Studio Portrait Key + Fill + Rim)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffb835, 1.2);
    fillLight.position.set(-3, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x1bd944, 2.5);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // MOUSE GAZE TRACKING INTERPOLATION
    let mouseX = 0;
    let mouseY = 0;
    let targetHeadRotY = 0;
    let targetHeadRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);

      targetHeadRotY = mouseX * 0.45;
      targetHeadRotX = -mouseY * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ANIMATION & SPEECH SYNCHRONIZATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkProgress = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth Head Tracking with Organic Saccades & Breathing
      const breathOffset = Math.sin(elapsed * 1.5) * 0.02;
      headGroup.position.y = 0.1 + breathOffset;

      const idleGazeDrift = Math.sin(elapsed * 0.8) * 0.04;
      headGroup.rotation.y += (targetHeadRotY + idleGazeDrift - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.08;
      headGroup.rotation.z = Math.sin(elapsed * 1.2) * 0.015;

      // Eye Tracking Cursor
      leftEye.rotation.y = (mouseX * 0.35 - leftEye.rotation.y) * 0.12;
      leftEye.rotation.x = (-mouseY * 0.35 - leftEye.rotation.x) * 0.12;
      rightEye.rotation.y = leftEye.rotation.y;
      rightEye.rotation.x = leftEye.rotation.x;

      // Realistic Blinking
      blinkTimer += 0.016;
      if (blinkTimer > 3.8 + Math.sin(elapsed) * 1.2) {
        isBlinking = true;
        blinkTimer = 0;
      }

      if (isBlinking) {
        blinkProgress += 0.18;
        const lidRotation = Math.sin(blinkProgress) * 1.2;
        leftUpperLid.rotation.x = lidRotation;
        rightUpperLid.rotation.x = lidRotation;
        if (blinkProgress >= Math.PI) {
          isBlinking = false;
          blinkProgress = 0;
          leftUpperLid.rotation.x = 0;
          rightUpperLid.rotation.x = 0;
        }
      }

      // Mouth Movement / Phoneme Articulation (Visemes)
      const speaking = isSpeakingRef.current;
      if (speaking) {
        const mouthOpen = Math.abs(Math.sin(elapsed * 14)) * 0.14 + Math.sin(elapsed * 9) * 0.06;
        jawGroup.position.y = -0.3 - mouthOpen * 0.6;
        lowerLip.position.y = -0.05 - mouthOpen;
        mouthCavityMat.emissiveIntensity = 0.9 + Math.sin(elapsed * 18) * 0.5;
        wireMat.opacity = 0.35;
      } else {
        jawGroup.position.y += (-0.3 - jawGroup.position.y) * 0.15;
        lowerLip.position.y += (-0.05 - lowerLip.position.y) * 0.15;
        mouthCavityMat.emissiveIntensity = 0.1;
        wireMat.opacity = 0.15;
      }

      // Splat Cloud and Rings Rotation
      splatCloud.rotation.y = elapsed * 0.05;
      orbitRing.rotation.z = elapsed * 0.08;

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
  }, [size, interactive]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: size, height: size }} />

      {/* Floating 3D Telemetry HUD (Tavus CVI Human Computing Metrics) */}
      {showHUD && (
        <>
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md border-2 border-[#140206] rounded-full text-[11px] font-mono font-bold text-[#140206] shadow-brutal-sm flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#1bd944] animate-ping" />
            <span>CVI 3D GAUSSIAN AVATAR</span>
          </div>

          <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-full text-[11px] font-mono font-bold text-[#140206] shadow-brutal-sm pointer-events-none">
            LATENCY: <span className="text-[#fd7f00]">{latency}ms</span>
          </div>

          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md border-2 border-[#140206] rounded-full text-[10px] font-mono text-[#5e5850] shadow-brutal-sm pointer-events-none">
            GAZE: <strong className="text-[#140206]">CURSOR TRACKED</strong>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <div
              className={`px-3.5 py-1.5 border-2 border-[#140206] rounded-full text-xs font-mono font-bold uppercase shadow-brutal-sm transition-all duration-300 ${
                isSpeaking
                  ? 'bg-[#1bd944] text-[#140206] scale-105'
                  : 'bg-[#ffda95] text-[#140206]'
              }`}
            >
              {isSpeaking ? '● LIVE SPEECH SYNTHESIS' : '○ LISTENING STREAM'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
