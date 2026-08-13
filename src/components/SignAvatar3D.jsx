import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, FastForward, UserCheck } from 'lucide-react';
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

export const SignAvatar3D = ({ activeSignKey = "HELLO", height = "340px" }) => {
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
      const h = parseInt(height) || 340;

      // 1. Scene Setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x090d16);

      // 2. Camera Setup
      const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 1000);
      camera.position.set(0, 1.35, 3.1);
      camera.lookAt(0, 1.05, 0);

      // 3. Renderer Setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      // Clear container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // 4. Warm Studio Lighting for 3D Human Avatar
      const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.85);
      scene.add(ambientLight);

      // Key Warm Light
      const keyLight = new THREE.DirectionalLight(0xffecd6, 1.3);
      keyLight.position.set(3, 4, 3);
      scene.add(keyLight);

      // Cool Rim Light
      const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
      rimLight.position.set(-3, 3, -2);
      scene.add(rimLight);

      // Soft Fill Light
      const fillLight = new THREE.DirectionalLight(0xa5f3fc, 0.5);
      fillLight.position.set(-2, 2, 2);
      scene.add(fillLight);

      // 5. Build 3D Human Avatar Mesh ("Alex - ASL Sign Interpreter")
      const avatarGroup = new THREE.Group();

      // Materials
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xf5c29b,
        roughness: 0.55,
        metalness: 0.05
      });

      const jacketMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.4,
        metalness: 0.1
      });

      const accentMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.2,
        roughness: 0.3
      });

      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x231815,
        roughness: 0.8
      });

      const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const eyeIrisMat = new THREE.MeshBasicMaterial({ color: 0x1e3a8a });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const lipMat = new THREE.MeshStandardMaterial({ color: 0xc25e5e, roughness: 0.6 });

      // Torso / Rider Jacket
      const torsoGeo = new THREE.CylinderGeometry(0.38, 0.28, 0.75, 20);
      const torso = new THREE.Mesh(torsoGeo, jacketMat);
      torso.position.y = 0.85;
      avatarGroup.add(torso);

      // Zipper / Trim
      const zipGeo = new THREE.BoxGeometry(0.04, 0.76, 0.02);
      const zip = new THREE.Mesh(zipGeo, accentMat);
      zip.position.set(0, 0.85, 0.28);
      avatarGroup.add(zip);

      // SignShift Chest Badge
      const badgeGeo = new THREE.BoxGeometry(0.18, 0.14, 0.04);
      const badge = new THREE.Mesh(badgeGeo, accentMat);
      badge.position.set(0.15, 1.0, 0.23);
      avatarGroup.add(badge);

      // Neck (Human Skin)
      const neckGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.16, 16);
      const neck = new THREE.Mesh(neckGeo, skinMat);
      neck.position.y = 1.3;
      avatarGroup.add(neck);

      // Head (Human Head Shape)
      const headGroup = new THREE.Group();
      headGroup.position.y = 1.52;

      const headGeo = new THREE.SphereGeometry(0.24, 32, 32);
      const head = new THREE.Mesh(headGeo, skinMat);
      headGroup.add(head);

      // Ears
      const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), skinMat);
      leftEar.position.set(-0.24, 0, 0);
      leftEar.scale.set(0.6, 1.2, 0.8);
      headGroup.add(leftEar);

      const rightEar = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), skinMat);
      rightEar.position.set(0.24, 0, 0);
      rightEar.scale.set(0.6, 1.2, 0.8);
      headGroup.add(rightEar);

      // Nose
      const noseGeo = new THREE.ConeGeometry(0.035, 0.08, 12);
      const nose = new THREE.Mesh(noseGeo, skinMat);
      nose.position.set(0, -0.02, 0.24);
      nose.rotation.x = -Math.PI / 6;
      headGroup.add(nose);

      // Lips / Mouth
      const lipsGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
      const lips = new THREE.Mesh(lipsGeo, lipMat);
      lips.position.set(0, -0.09, 0.22);
      headGroup.add(lips);

      // Styled 3D Hair
      const hairGeo = new THREE.SphereGeometry(0.255, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 0.02, -0.01);
      hair.rotation.x = -0.15;
      headGroup.add(hair);

      // Hair Bang Fringe
      const fringeGeo = new THREE.BoxGeometry(0.2, 0.06, 0.08);
      const fringe = new THREE.Mesh(fringeGeo, hairMat);
      fringe.position.set(0, 0.2, 0.16);
      fringe.rotation.x = 0.3;
      headGroup.add(fringe);

      // Eyes Group
      // Left Eye
      const leftEyeGroup = new THREE.Group();
      leftEyeGroup.position.set(-0.08, 0.04, 0.21);
      const leftSclera = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), eyeWhiteMat);
      const leftIris = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), eyeIrisMat);
      leftIris.position.z = 0.02;
      const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), pupilMat);
      leftPupil.position.z = 0.03;
      leftEyeGroup.add(leftSclera);
      leftEyeGroup.add(leftIris);
      leftEyeGroup.add(leftPupil);
      headGroup.add(leftEyeGroup);

      // Right Eye
      const rightEyeGroup = new THREE.Group();
      rightEyeGroup.position.set(0.08, 0.04, 0.21);
      const rightSclera = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), eyeWhiteMat);
      const rightIris = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), eyeIrisMat);
      rightIris.position.z = 0.02;
      const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), pupilMat);
      rightPupil.position.z = 0.03;
      rightEyeGroup.add(rightSclera);
      rightEyeGroup.add(rightIris);
      rightEyeGroup.add(rightPupil);
      headGroup.add(rightEyeGroup);

      // Eyebrows
      const browGeo = new THREE.BoxGeometry(0.07, 0.015, 0.02);
      const leftBrow = new THREE.Mesh(browGeo, hairMat);
      leftBrow.position.set(-0.08, 0.1, 0.22);
      leftBrow.rotation.z = 0.1;
      headGroup.add(leftBrow);

      const rightBrow = new THREE.Mesh(browGeo, hairMat);
      rightBrow.position.set(0.08, 0.1, 0.22);
      rightBrow.rotation.z = -0.1;
      headGroup.add(rightBrow);

      avatarGroup.add(headGroup);

      // --- Helper to Build 5-Finger Human Hand ---
      const createHumanHand = () => {
        const handGroup = new THREE.Group();
        // Palm
        const palmGeo = new THREE.BoxGeometry(0.11, 0.12, 0.035);
        const palm = new THREE.Mesh(palmGeo, skinMat);
        handGroup.add(palm);

        // 5 Fingers
        for (let i = 0; i < 4; i++) {
          const fingerGeo = new THREE.CylinderGeometry(0.012, 0.01, 0.07, 8);
          const finger = new THREE.Mesh(fingerGeo, skinMat);
          finger.position.set(-0.04 + i * 0.027, -0.09, 0);
          handGroup.add(finger);
        }
        // Thumb
        const thumbGeo = new THREE.CylinderGeometry(0.013, 0.011, 0.06, 8);
        const thumb = new THREE.Mesh(thumbGeo, skinMat);
        thumb.position.set(0.06, -0.03, 0.02);
        thumb.rotation.z = -Math.PI / 4;
        handGroup.add(thumb);

        return handGroup;
      };

      // Right Arm Setup
      const rightShoulder = new THREE.Group();
      rightShoulder.position.set(0.44, 1.15, 0);
      const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.35, 16), jacketMat);
      rightUpperArm.position.y = -0.18;
      rightShoulder.add(rightUpperArm);

      const rightElbow = new THREE.Group();
      rightElbow.position.y = -0.36;
      rightShoulder.add(rightElbow);

      // Forearm (Human Skin)
      const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.32, 16), skinMat);
      rightForearm.position.y = -0.16;
      rightElbow.add(rightForearm);

      // Right Hand
      const rightHand = createHumanHand();
      rightHand.position.y = -0.36;
      rightElbow.add(rightHand);

      avatarGroup.add(rightShoulder);

      // Left Arm Setup
      const leftShoulder = new THREE.Group();
      leftShoulder.position.set(-0.44, 1.15, 0);
      const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.35, 16), jacketMat);
      leftUpperArm.position.y = -0.18;
      leftShoulder.add(leftUpperArm);

      const leftElbow = new THREE.Group();
      leftElbow.position.y = -0.36;
      leftShoulder.add(leftElbow);

      // Forearm (Human Skin)
      const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.32, 16), skinMat);
      leftForearm.position.y = -0.16;
      leftElbow.add(leftForearm);

      // Left Hand
      const leftHand = createHumanHand();
      leftHand.position.y = -0.36;
      leftElbow.add(leftHand);

      avatarGroup.add(leftShoulder);

      // Studio Platform Base
      const baseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.1, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.7 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.4;
      scene.add(base);

      // Hologram Ring Accent
      const ringGeo = new THREE.RingGeometry(0.75, 0.82, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.46;
      scene.add(ring);

      scene.add(avatarGroup);

      // 6. Real-Time Procedural ASL Animation Sequences
      let startTime = Date.now();

      const animate = () => {
        animReqRef.current = requestAnimationFrame(animate);
        const elapsed = (Date.now() - startTime) * 0.001 * signSpeed;

        // Base Idle breathing & micro movements
        torso.position.y = 0.85 + Math.sin(elapsed * 2) * 0.012;
        headGroup.position.y = 1.52 + Math.sin(elapsed * 2) * 0.01;
        headGroup.rotation.y = Math.sin(elapsed * 1.2) * 0.04; // Gentle natural head tilt
        ring.rotation.z = elapsed * 0.3;

        // ASL Gestures
        if (activeSignKey === "HELLO") {
          setCurrentFrameText("Touching temple ➔ Sweeping hand outward 👋");
          rightShoulder.rotation.z = Math.sin(elapsed * 4) * 0.2 - 0.85;
          rightShoulder.rotation.x = -1.25 + Math.sin(elapsed * 4) * 0.3;
          rightElbow.rotation.x = -1.05;
          rightElbow.rotation.z = Math.sin(elapsed * 6) * 0.35;

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
      console.warn("WebGL initialization error:", err);
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
              <p className="text-xs text-white/80">Visual Sign Fallback Card (3D Human Mode)</p>
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
          <span>SignShift 3D Human Engine</span>
          <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> High Visibility</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-2xl group">
      {/* Top Header Badge */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/40 shadow-lg">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
            3D Human Sign Avatar: {signData.label}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Speed Selector */}
          <button 
            onClick={() => setSignSpeed(signSpeed === 1 ? 1.5 : signSpeed === 1.5 ? 0.5 : 1)}
            className="bg-slate-950/85 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-xs px-3 py-1 rounded-full font-bold transition flex items-center gap-1 shadow-lg"
            title="Adjust Animation Speed"
          >
            <FastForward className="w-3.5 h-3.5" />
            {signSpeed}x
          </button>
        </div>
      </div>

      {/* Three.js 3D Human Canvas Container */}
      <div ref={mountRef} className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 cursor-grab active:cursor-grabbing" style={{ height }} />

      {/* Subtitle / Phrase Breakdown Banner */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 flex items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{signData.icon}</span>
          <div>
            <p className="text-xs text-cyan-400 font-bold tracking-wider uppercase">ASL Translation</p>
            <p className="text-sm font-bold text-slate-100">{currentFrameText}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-800 font-extrabold uppercase tracking-wider">
            Real-Time 3D Human
          </span>
        </div>
      </div>
    </div>
  );
};
