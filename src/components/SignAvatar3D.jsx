import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Eye, Sparkles, Volume2, FastForward } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SIGN_DICTIONARY = {
  "HELLO": {
    label: "Hello / Greetings",
    description: "Hand touches temple and sweeps outward with open palm",
    icon: "👋",
    duration: 2000,
    visualCard: {
      title: "Friendly Greeting",
      cue: "Rider is greeting you",
      bgGradient: "from-cyan-600 to-blue-600"
    }
  },
  "LEAVE AT DOOR": {
    label: "Leave at Door",
    description: "Palms facing down moving gently towards floor",
    icon: "🚪",
    duration: 2500,
    visualCard: {
      title: "Leave Food Outside Door",
      cue: "Place parcel on doorstep, ring bell & step back",
      bgGradient: "from-emerald-600 to-teal-700"
    }
  },
  "GATE CODE": {
    label: "Gate Code / Intercom",
    description: "Fingers tapping imaginary keypad digits",
    icon: "🔢",
    duration: 2200,
    visualCard: {
      title: "Building Gate Code: 4022",
      cue: "Enter 4022 on keypad or dial unit 4B",
      bgGradient: "from-amber-600 to-yellow-600"
    }
  },
  "FOOD PICKED UP": {
    label: "Food Picked Up",
    description: "Both hands cradling bag and lifting upwards",
    icon: "🛍️",
    duration: 2200,
    visualCard: {
      title: "Order Secured at Restaurant",
      cue: "Food hot in thermal container, heading to motorcycle",
      bgGradient: "from-blue-600 to-indigo-700"
    }
  },
  "I AM OUTSIDE": {
    label: "I'm Outside / Arrived",
    description: "Index fingers pointing towards window/door with double tap",
    icon: "📍",
    duration: 2000,
    visualCard: {
      title: "Rider Has Arrived Outside",
      cue: "Alex is waiting outside building entrance",
      bgGradient: "from-cyan-500 to-emerald-600"
    }
  },
  "TRAFFIC DELAY": {
    label: "Traffic Delay",
    description: "Hands making alternating wave motions representing traffic flow",
    icon: "🚦",
    duration: 2400,
    visualCard: {
      title: "Heavy Traffic En Route",
      cue: "Slight 3-5 min delay due to downtown congestion",
      bgGradient: "from-amber-500 to-orange-600"
    }
  },
  "THANK YOU": {
    label: "Thank You!",
    description: "Flat hand touch chin and blow forward gesture",
    icon: "🙏",
    duration: 2000,
    visualCard: {
      title: "Thank You & Have a Great Day!",
      cue: "Rider appreciates your clear communication",
      bgGradient: "from-purple-600 to-pink-600"
    }
  }
};

export const SignAvatar3D = ({ activeSignKey = "HELLO", height = "320px", showControls = true }) => {
  const mountRef = useRef(null);
  const { signSpeed, setSignSpeed, reducedMotion } = useApp();
  const [webGlError, setWebGlError] = useState(false);
  const [currentFrameText, setCurrentFrameText] = useState("");
  const animReqRef = useRef(null);

  const signData = SIGN_DICTIONARY[activeSignKey] || SIGN_DICTIONARY["HELLO"];

  useEffect(() => {
    if (!mountRef.current || reducedMotion || webGlError) return;

    let renderer = null;
    let container = mountRef.current;

    try {
      const width = container.clientWidth || 300;
      const h = parseInt(height) || 320;

      // 1. Scene Setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);

      // 2. Camera Setup
      const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 1000);
      camera.position.set(0, 1.3, 3.2);
      camera.lookAt(0, 1.0, 0);

      // 3. Renderer Setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      // Clear previous canvas
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.4); // Electric cyan key light
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x22c55e, 0.8); // Emerald fill light
    dirLight2.position.set(-3, 2, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00ffff, 1.2, 10);
    pointLight.position.set(0, 1.5, 1.5);
    scene.add(pointLight);

    // 5. Construct 3D Stylized Avatar (Torso, Neck, Head, Shoulders, Arms, Hands)
    const avatarGroup = new THREE.Group();

    // Body Material
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.2
    });

    // High-visibility Suit Accents
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      roughness: 0.2
    });

    // Hand Material (High-contrast gold skin/glove)
    const handMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.2,
      roughness: 0.4
    });

    // Head Material
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
      wireframe: false
    });

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.28, 0.75, 16);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = 0.85;
    avatarGroup.add(torso);

    // Chest Badge (SignShift Icon)
    const badgeGeo = new THREE.BoxGeometry(0.18, 0.14, 0.04);
    const badge = new THREE.Mesh(badgeGeo, accentMat);
    badge.position.set(0, 1.0, 0.22);
    avatarGroup.add(badge);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.16, 12);
    const neck = new THREE.Mesh(neckGeo, bodyMat);
    neck.position.y = 1.3;
    avatarGroup.add(neck);

    // Head (Stylized Sphere with visor)
    const headGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.52;
    avatarGroup.add(head);

    // Visor / Eyes glow
    const visorGeo = new THREE.BoxGeometry(0.28, 0.08, 0.15);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.54, 0.16);
    avatarGroup.add(visor);

    // Shoulders & Arms Group Setup
    // Right Arm Pivot
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.44, 1.15, 0);

    const rightUpperArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.35, 12);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, bodyMat);
    rightUpperArm.position.y = -0.18;
    rightShoulder.add(rightUpperArm);

    const rightElbow = new THREE.Group();
    rightElbow.position.y = -0.36;
    rightShoulder.add(rightElbow);

    const rightForearmGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.32, 12);
    const rightForearm = new THREE.Mesh(rightForearmGeo, accentMat);
    rightForearm.position.y = -0.16;
    rightElbow.add(rightForearm);

    // Right Hand
    const rightHandGeo = new THREE.BoxGeometry(0.12, 0.14, 0.04);
    const rightHand = new THREE.Mesh(rightHandGeo, handMat);
    rightHand.position.y = -0.38;
    rightElbow.add(rightHand);

    avatarGroup.add(rightShoulder);

    // Left Arm Pivot
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.44, 1.15, 0);

    const leftUpperArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.35, 12);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, bodyMat);
    leftUpperArm.position.y = -0.18;
    leftShoulder.add(leftUpperArm);

    const leftElbow = new THREE.Group();
    leftElbow.position.y = -0.36;
    leftShoulder.add(leftElbow);

    const leftForearmGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.32, 12);
    const leftForearm = new THREE.Mesh(leftForearmGeo, accentMat);
    leftForearm.position.y = -0.16;
    leftElbow.add(leftForearm);

    // Left Hand
    const leftHandGeo = new THREE.BoxGeometry(0.12, 0.14, 0.04);
    const leftHand = new THREE.Mesh(leftHandGeo, handMat);
    leftHand.position.y = -0.38;
    leftElbow.add(leftHand);

    avatarGroup.add(leftShoulder);

    // Platform Base
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.1, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.4;
    scene.add(base);

    // Hologram Ring
    const ringGeo = new THREE.RingGeometry(0.7, 0.78, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.46;
    scene.add(ring);

    scene.add(avatarGroup);

    // 6. Animation Logic based on activeSignKey
    let startTime = Date.now();

    const animate = () => {
      animReqRef.current = requestAnimationFrame(animate);

      const elapsed = (Date.now() - startTime) * 0.001 * signSpeed;

      // Base idle subtle breathing
      torso.position.y = 0.85 + Math.sin(elapsed * 2) * 0.015;
      head.position.y = 1.52 + Math.sin(elapsed * 2) * 0.01;
      visor.position.y = 1.54 + Math.sin(elapsed * 2) * 0.01;
      ring.rotation.z = elapsed * 0.5;

      // Procedural Sign Language Sequences
      if (activeSignKey === "HELLO") {
        setCurrentFrameText("Touching temple ➔ Sweeping hand outward 👋");
        rightShoulder.rotation.z = Math.sin(elapsed * 4) * 0.2 - 0.8;
        rightShoulder.rotation.x = -1.2 + Math.sin(elapsed * 4) * 0.3;
        rightElbow.rotation.x = -1.0;
        rightElbow.rotation.z = Math.sin(elapsed * 6) * 0.4;
        leftShoulder.rotation.z = 0.2;
        leftElbow.rotation.x = -0.2;
      } else if (activeSignKey === "LEAVE AT DOOR") {
        setCurrentFrameText("Palms facing down ➔ Lowering to threshold 🚪");
        rightShoulder.rotation.x = -0.8 + Math.sin(elapsed * 3) * 0.2;
        rightShoulder.rotation.z = -0.3;
        rightElbow.rotation.x = -0.9 + Math.sin(elapsed * 3) * 0.3;
        
        leftShoulder.rotation.x = -0.8 + Math.sin(elapsed * 3) * 0.2;
        leftShoulder.rotation.z = 0.3;
        leftElbow.rotation.x = -0.9 + Math.sin(elapsed * 3) * 0.3;
      } else if (activeSignKey === "GATE CODE") {
        setCurrentFrameText("Tapping digital keypad digits in air 🔢");
        rightShoulder.rotation.x = -1.3;
        rightShoulder.rotation.z = -0.2;
        rightElbow.rotation.x = -0.8;
        rightElbow.rotation.y = Math.sin(elapsed * 12) * 0.4;
        
        leftShoulder.rotation.x = -0.4;
        leftElbow.rotation.x = -0.5;
      } else if (activeSignKey === "FOOD PICKED UP") {
        setCurrentFrameText("Cradling thermal parcel ➔ Lifting securely 🛍️");
        rightShoulder.rotation.x = -0.6 + Math.sin(elapsed * 2.5) * 0.25;
        rightShoulder.rotation.z = -0.4;
        rightElbow.rotation.x = -1.2;
        
        leftShoulder.rotation.x = -0.6 + Math.sin(elapsed * 2.5) * 0.25;
        leftShoulder.rotation.z = 0.4;
        leftElbow.rotation.x = -1.2;
      } else if (activeSignKey === "I AM OUTSIDE") {
        setCurrentFrameText("Double tap index forward ➔ Pointing to entrance 📍");
        rightShoulder.rotation.x = -1.1 + Math.sin(elapsed * 5) * 0.15;
        rightShoulder.rotation.z = -0.1;
        rightElbow.rotation.x = -0.7;

        leftShoulder.rotation.x = -0.3;
        leftElbow.rotation.x = -0.2;
      } else if (activeSignKey === "TRAFFIC DELAY") {
        setCurrentFrameText("Wavy traffic motion ➔ Caution ahead 🚦");
        rightShoulder.rotation.x = -0.7;
        rightShoulder.rotation.z = -0.5 + Math.sin(elapsed * 4) * 0.3;
        rightElbow.rotation.z = Math.cos(elapsed * 4) * 0.4;

        leftShoulder.rotation.x = -0.7;
        leftShoulder.rotation.z = 0.5 + Math.sin(elapsed * 4) * 0.3;
        leftElbow.rotation.z = -Math.cos(elapsed * 4) * 0.4;
      } else if (activeSignKey === "THANK YOU") {
        setCurrentFrameText("Chin contact ➔ Blowing gratitude forward 🙏");
        rightShoulder.rotation.x = -1.5 + Math.sin(elapsed * 3) * 0.4;
        rightShoulder.rotation.z = -0.2;
        rightElbow.rotation.x = -1.4 + Math.sin(elapsed * 3) * 0.5;

        leftShoulder.rotation.z = 0.2;
        leftElbow.rotation.x = -0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      camera.aspect = newW / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animReqRef.current) cancelAnimationFrame(animReqRef.current);
      if (renderer && renderer.domElement && container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) renderer.dispose();
    };
    } catch (err) {
      console.warn("WebGL initialization failed, falling back to static visual card:", err);
      setWebGlError(true);
    }
  }, [activeSignKey, signSpeed, height, reducedMotion, webGlError]);

  if (reducedMotion || webGlError) {
    return (
      <div className={`w-full rounded-2xl bg-gradient-to-br ${signData.visualCard.bgGradient} p-6 text-white shadow-xl flex flex-col justify-between`} style={{ minHeight: height }}>
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{signData.icon}</span>
            <div>
              <h4 className="font-bold text-xl">{signData.visualCard.title}</h4>
              <p className="text-xs text-white/80">Visual Sign Fallback Card (Reduced Motion)</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider">
            {activeSignKey}
          </span>
        </div>
        <div className="my-4 bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <p className="text-lg font-medium">{signData.visualCard.cue}</p>
          <p className="text-xs text-white/70 mt-1 italic">Sign description: {signData.description}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>SignShift ASL Engine</span>
          <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> High Visibility</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl group">
      {/* Top Header Badge */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/40">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            3D Sign Avatar: {signData.label}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Speed Selector */}
          <button 
            onClick={() => setSignSpeed(signSpeed === 1 ? 1.5 : signSpeed === 1.5 ? 0.5 : 1)}
            className="bg-slate-950/80 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-xs px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1"
            title="Adjust Animation Speed"
          >
            <FastForward className="w-3 h-3" />
            {signSpeed}x
          </button>
        </div>
      </div>

      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 cursor-grab active:cursor-grabbing" style={{ height }} />

      {/* Subtitle / Phrase Breakdown Banner */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{signData.icon}</span>
          <div>
            <p className="text-xs text-cyan-400 font-semibold tracking-wide uppercase">ASL Translation</p>
            <p className="text-sm font-bold text-slate-100">{currentFrameText}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
            Real-Time 3D
          </span>
        </div>
      </div>
    </div>
  );
};
