import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, FastForward, UserCheck, RotateCcw, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SIGN_DICTIONARY = {
  "HELLO": {
    label: "Hello / Greetings",
    description: "Hand touches temple and sweeps outward with open palm in friendly salute",
    icon: "👋",
    duration: 2000,
    visualCard: {
      title: "Friendly Greeting",
      cue: "Rider is greeting you with ASL salute",
      bgGradient: "from-cyan-600 to-blue-600"
    }
  },
  "LEAVE AT DOOR": {
    label: "Leave at Door",
    description: "Palms flat facing downward pressing gently towards doorstep",
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
    description: "Index finger tapping keypad digits in 3D air",
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
    description: "Both hands cupped underneath parcel and lifting securely to chest",
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
    description: "Index finger pointing forward with double tap gesture towards entrance",
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
    description: "Hands alternating undulating waves signifying street congestion",
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
    description: "Fingertips touch chin and sweep forward towards user with warm nod",
    icon: "🙏",
    duration: 2000,
    visualCard: {
      title: "Thank You & Have a Great Day!",
      cue: "Rider appreciates your clear communication",
      bgGradient: "from-purple-600 to-pink-600"
    }
  }
};

export const SignAvatar3D = ({ activeSignKey, activePhraseKey, height = "400px" }) => {
  const mountRef = useRef(null);
  const { signSpeed, setSignSpeed, reducedMotion, sectorColors } = useApp();
  const avatarAccentColor = sectorColors?.avatar || '#06B6D4';
  const [webGlError, setWebGlError] = useState(false);
  const [currentFrameText, setCurrentFrameText] = useState("");
  const animReqRef = useRef(null);
  const avatarGroupRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseXRef = useRef(0);
  const userRotationYRef = useRef(0);

  // Normalize sign key from props
  const resolvedKey = activeSignKey || activePhraseKey || "HELLO";
  const signData = SIGN_DICTIONARY[resolvedKey] || SIGN_DICTIONARY["HELLO"];

  const handleResetRotation = () => {
    userRotationYRef.current = 0;
    if (avatarGroupRef.current) {
      avatarGroupRef.current.rotation.y = 0;
    }
  };

  useEffect(() => {
    if (!mountRef.current || reducedMotion || webGlError) return;

    let renderer = null;
    const container = mountRef.current;

    try {
      const width = container.clientWidth || 340;
      const h = parseInt(height) || 400;

      // 1. Scene Setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x070b14);

      // Subtle fog for depth
      scene.fog = new THREE.FogExp2(0x070b14, 0.08);

      // 2. Camera Setup (framed to capture Alex's full human anatomy from shoes to hair)
      const camera = new THREE.PerspectiveCamera(42, width / h, 0.1, 100);
      camera.position.set(0, 1.25, 3.1);
      camera.lookAt(0, 0.95, 0);

      // 3. Renderer Setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);

      // 4. Studio Cinematic Lighting
      const ambientLight = new THREE.AmbientLight(0xfff1e6, 0.9);
      scene.add(ambientLight);

      // Key Warm Light
      const keyLight = new THREE.DirectionalLight(0xffeedd, 1.4);
      keyLight.position.set(2.5, 3.5, 3);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Cool Dynamic Rim Light (Accentuates human silhouette)
      const rimLight = new THREE.DirectionalLight(new THREE.Color(avatarAccentColor), 1.3);
      rimLight.position.set(-3, 2.5, -2);
      scene.add(rimLight);

      // Soft Fill Light
      const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
      fillLight.position.set(-2, 1.5, 2.5);
      scene.add(fillLight);

      // Warm Under-glow from podium
      const podiumLight = new THREE.PointLight(0x0ea5e9, 1.2, 3);
      podiumLight.position.set(0, 0.1, 0);
      scene.add(podiumLight);

      // 5. Materials
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xf6be98,
        roughness: 0.62,
        metalness: 0.04
      });

      const skinShadeMat = new THREE.MeshStandardMaterial({
        color: 0xebac82,
        roughness: 0.65,
        metalness: 0.04
      });

      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x221815,
        roughness: 0.85,
        metalness: 0.05
      });

      const jacketMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b, // Dark slate courier softshell
        roughness: 0.5,
        metalness: 0.1
      });

      const jacketAccentMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(avatarAccentColor),
        roughness: 0.3,
        metalness: 0.2,
        emissive: new THREE.Color(avatarAccentColor),
        emissiveIntensity: 0.25
      });

      const pantsMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a, // Deep charcoal courier trousers
        roughness: 0.7,
        metalness: 0.05
      });

      const beltMat = new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.4,
        metalness: 0.3
      });

      const buckleMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.2,
        metalness: 0.85
      });

      const shoeWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.35,
        metalness: 0.1
      });

      const shoeAccentMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.4
      });

      const watchMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
        metalness: 0.8
      });

      const watchScreenMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8
      });

      const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
      const eyeIrisMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.3 });
      const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x050811 });
      const eyeCatchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const lipMat = new THREE.MeshStandardMaterial({ color: 0xc46969, roughness: 0.55 });
      const nailMat = new THREE.MeshStandardMaterial({ color: 0xfbd0b3, roughness: 0.3 });

      // 6. BUILD COMPLETE HUMAN ANATOMY AVATAR ("Alex")
      const avatarGroup = new THREE.Group();
      avatarGroupRef.current = avatarGroup;
      avatarGroup.position.y = -0.05;

      // ==================== LOWER BODY (Full Human Form) ====================
      const lowerBodyGroup = new THREE.Group();

      // Hips / Pelvis
      const hipsGeo = new THREE.CylinderGeometry(0.24, 0.21, 0.2, 16);
      const hips = new THREE.Mesh(hipsGeo, pantsMat);
      hips.position.y = 0.65;
      lowerBodyGroup.add(hips);

      // Belt & Buckle
      const beltGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.05, 16);
      const belt = new THREE.Mesh(beltGeo, beltMat);
      belt.position.y = 0.74;
      lowerBodyGroup.add(belt);

      const buckleGeo = new THREE.BoxGeometry(0.08, 0.05, 0.04);
      const buckle = new THREE.Mesh(buckleGeo, buckleMat);
      buckle.position.set(0, 0.74, 0.24);
      lowerBodyGroup.add(buckle);

      // Helper to build human leg (thigh, knee, calf, high-top sneaker)
      const createHumanLeg = (isLeft) => {
        const legGroup = new THREE.Group();
        const sign = isLeft ? -1 : 1;
        legGroup.position.set(sign * 0.13, 0.62, 0);

        // Thigh
        const thighGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.35, 14);
        const thigh = new THREE.Mesh(thighGeo, pantsMat);
        thigh.position.y = -0.17;
        legGroup.add(thigh);

        // Knee Joint
        const kneeGeo = new THREE.SphereGeometry(0.078, 12, 12);
        const knee = new THREE.Mesh(kneeGeo, pantsMat);
        knee.position.set(0, -0.34, 0.01);
        legGroup.add(knee);

        // Calf / Shin
        const calfGeo = new THREE.CylinderGeometry(0.076, 0.062, 0.34, 14);
        const calf = new THREE.Mesh(calfGeo, pantsMat);
        calf.position.y = -0.51;
        legGroup.add(calf);

        // Ankle
        const ankleGeo = new THREE.SphereGeometry(0.06, 12, 12);
        const ankle = new THREE.Mesh(ankleGeo, pantsMat);
        ankle.position.y = -0.68;
        legGroup.add(ankle);

        // Human Courier Sneaker / High-top
        const shoeGroup = new THREE.Group();
        shoeGroup.position.set(0, -0.71, 0.04);

        // Sole
        const soleGeo = new THREE.BoxGeometry(0.12, 0.04, 0.26);
        const sole = new THREE.Mesh(soleGeo, shoeWhiteMat);
        sole.position.y = -0.01;
        shoeGroup.add(sole);

        // Upper Shoe Body
        const upperGeo = new THREE.BoxGeometry(0.11, 0.07, 0.22);
        const upper = new THREE.Mesh(upperGeo, shoeAccentMat);
        upper.position.set(0, 0.03, 0.01);
        shoeGroup.add(upper);

        // Toe Cap
        const toeGeo = new THREE.SphereGeometry(0.055, 12, 10);
        const toe = new THREE.Mesh(toeGeo, shoeWhiteMat);
        toe.scale.set(1, 0.7, 1.2);
        toe.position.set(0, 0.02, 0.09);
        shoeGroup.add(toe);

        legGroup.add(shoeGroup);
        return legGroup;
      };

      const leftLeg = createHumanLeg(true);
      const rightLeg = createHumanLeg(false);
      lowerBodyGroup.add(leftLeg);
      lowerBodyGroup.add(rightLeg);
      avatarGroup.add(lowerBodyGroup);

      // ==================== UPPER BODY & TORSO ====================
      const upperBodyGroup = new THREE.Group();
      upperBodyGroup.position.y = 0.75;

      // Abdomen / Midsection
      const midTorsoGeo = new THREE.CylinderGeometry(0.25, 0.23, 0.22, 16);
      const midTorso = new THREE.Mesh(midTorsoGeo, jacketMat);
      midTorso.position.y = 0.11;
      upperBodyGroup.add(midTorso);

      // Chest / Ribcage (Athletic contoured shape)
      const chestGeo = new THREE.CylinderGeometry(0.3, 0.25, 0.32, 18);
      const chest = new THREE.Mesh(chestGeo, jacketMat);
      chest.position.y = 0.34;
      chest.scale.set(1.08, 1, 0.82); // Wider chest, flatter profile like human torso
      upperBodyGroup.add(chest);

      // Hi-Vis Cyan Jacket Zipper & Front Trim
      const zipGeo = new THREE.BoxGeometry(0.025, 0.52, 0.02);
      const zipper = new THREE.Mesh(zipGeo, jacketAccentMat);
      zipper.position.set(0, 0.24, 0.22);
      upperBodyGroup.add(zipper);

      // Jacket Collar (Standing athletic courier collar)
      const collarGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.08, 16, 1, true);
      const collar = new THREE.Mesh(collarGeo, jacketMat);
      collar.position.set(0, 0.52, 0);
      upperBodyGroup.add(collar);

      // Collar trim
      const collarTrimGeo = new THREE.TorusGeometry(0.14, 0.015, 8, 20);
      const collarTrim = new THREE.Mesh(collarTrimGeo, jacketAccentMat);
      collarTrim.rotation.x = Math.PI / 2;
      collarTrim.position.set(0, 0.55, 0);
      upperBodyGroup.add(collarTrim);

      // SignShift Rider Crest Badge
      const badgeGroup = new THREE.Group();
      badgeGroup.position.set(0.14, 0.38, 0.2);
      badgeGroup.rotation.y = -0.25;
      const badgeBg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.02), jacketAccentMat);
      const badgeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.025), watchScreenMat);
      badgeGroup.add(badgeBg);
      badgeGroup.add(badgeGlow);
      upperBodyGroup.add(badgeGroup);

      // Clavicle & Neck Base
      const neckBaseGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.12, 16);
      const neckBase = new THREE.Mesh(neckBaseGeo, skinMat);
      neckBase.position.y = 0.54;
      upperBodyGroup.add(neckBase);

      // Human Neck
      const neckGeo = new THREE.CylinderGeometry(0.092, 0.105, 0.16, 16);
      const neck = new THREE.Mesh(neckGeo, skinMat);
      neck.position.y = 0.65;
      upperBodyGroup.add(neck);

      // Subtle Adams apple / throat contour
      const laryGeo = new THREE.ConeGeometry(0.02, 0.04, 8);
      const larynx = new THREE.Mesh(laryGeo, skinShadeMat);
      larynx.rotation.x = -Math.PI / 2;
      larynx.position.set(0, 0.64, 0.095);
      upperBodyGroup.add(larynx);

      // ==================== HEAD & EXPRESSIVE HUMAN FACE ====================
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.88, 0.02);

      // Cranium (Anatomically shaped: taller, rounded back, tapered front)
      const craniumGeo = new THREE.SphereGeometry(0.2, 28, 24);
      const cranium = new THREE.Mesh(craniumGeo, skinMat);
      cranium.scale.set(0.95, 1.08, 1.02);
      headGroup.add(cranium);

      // Jaw & Chin (Smooth tapered lower face)
      const jawGeo = new THREE.CylinderGeometry(0.14, 0.07, 0.15, 16);
      const jaw = new THREE.Mesh(jawGeo, skinMat);
      jaw.position.set(0, -0.12, 0.04);
      headGroup.add(jaw);

      const chinTipGeo = new THREE.SphereGeometry(0.055, 14, 14);
      const chinTip = new THREE.Mesh(chinTipGeo, skinMat);
      chinTip.position.set(0, -0.18, 0.08);
      chinTip.scale.set(1.1, 0.8, 1);
      headGroup.add(chinTip);

      // Cheekbones (Gives natural human structure)
      const leftCheek = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), skinMat);
      leftCheek.position.set(-0.11, -0.04, 0.13);
      leftCheek.scale.set(0.8, 1, 0.8);
      headGroup.add(leftCheek);

      const rightCheek = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), skinMat);
      rightCheek.position.set(0.11, -0.04, 0.13);
      rightCheek.scale.set(0.8, 1, 0.8);
      headGroup.add(rightCheek);

      // Human Ears (Curved cartilage)
      const createHumanEar = (isLeft) => {
        const earGroup = new THREE.Group();
        const sign = isLeft ? -1 : 1;
        earGroup.position.set(sign * 0.19, -0.02, 0);
        earGroup.rotation.y = sign * 0.2;

        const earOuter = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), skinMat);
        earOuter.scale.set(0.4, 1.1, 0.7);
        earGroup.add(earOuter);

        const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), skinShadeMat);
        earInner.scale.set(0.3, 0.8, 0.5);
        earInner.position.set(sign * -0.01, 0, 0.01);
        earGroup.add(earInner);

        return earGroup;
      };
      headGroup.add(createHumanEar(true));
      headGroup.add(createHumanEar(false));

      // Sculpted Human Nose (Bridge, tip, subtle nostrils)
      const noseBridge = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.09, 0.04), skinMat);
      noseBridge.position.set(0, -0.02, 0.19);
      noseBridge.rotation.x = -0.22;
      headGroup.add(noseBridge);

      const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), skinMat);
      noseTip.position.set(0, -0.065, 0.21);
      headGroup.add(noseTip);

      const leftNostril = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), skinShadeMat);
      leftNostril.position.set(-0.025, -0.07, 0.195);
      headGroup.add(leftNostril);

      const rightNostril = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), skinShadeMat);
      rightNostril.position.set(0.025, -0.07, 0.195);
      headGroup.add(rightNostril);

      // Human Mouth & Lips
      const mouthGroup = new THREE.Group();
      mouthGroup.position.set(0, -0.12, 0.165);

      // Upper Lip (With Cupid's bow contour)
      const upperLip = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.01, 0.07, 12), lipMat);
      upperLip.rotation.z = Math.PI / 2;
      upperLip.position.set(0, 0.01, 0.015);
      mouthGroup.add(upperLip);

      // Lower Lip (Fuller cushion)
      const lowerLip = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.012, 0.065, 12), lipMat);
      lowerLip.rotation.z = Math.PI / 2;
      lowerLip.position.set(0, -0.01, 0.012);
      mouthGroup.add(lowerLip);

      headGroup.add(mouthGroup);

      // Human Eyes with Eyelids & Catchlight
      const leftEyelidGroup = new THREE.Group();
      const rightEyelidGroup = new THREE.Group();

      const createHumanEye = (isLeft) => {
        const eyeGroup = new THREE.Group();
        const sign = isLeft ? -1 : 1;
        eyeGroup.position.set(sign * 0.068, 0.02, 0.17);

        // Eyeball (White Sclera)
        const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), eyeWhiteMat);
        eyeGroup.add(eyeball);

        // Iris
        const iris = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.005, 16), eyeIrisMat);
        iris.rotation.x = Math.PI / 2;
        iris.position.z = 0.026;
        eyeGroup.add(iris);

        // Pupil
        const pupil = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 14), eyePupilMat);
        pupil.rotation.x = Math.PI / 2;
        pupil.position.z = 0.027;
        eyeGroup.add(pupil);

        // Specular Catchlight (Gives natural spark of life)
        const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 8, 8), eyeCatchlightMat);
        catchlight.position.set(sign * -0.005, 0.005, 0.03);
        eyeGroup.add(catchlight);

        // Upper Eyelid for Blinking
        const lidGeo = new THREE.SphereGeometry(0.033, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const eyelid = new THREE.Mesh(lidGeo, skinMat);
        eyelid.position.z = 0.002;

        const lidWrapper = isLeft ? leftEyelidGroup : rightEyelidGroup;
        lidWrapper.position.copy(eyeGroup.position);
        lidWrapper.add(eyelid);
        headGroup.add(lidWrapper);

        return eyeGroup;
      };

      headGroup.add(createHumanEye(true));
      headGroup.add(createHumanEye(false));

      // Natural Human Eyebrows
      const leftBrowGeo = new THREE.BoxGeometry(0.065, 0.016, 0.02);
      const leftBrow = new THREE.Mesh(leftBrowGeo, hairMat);
      leftBrow.position.set(-0.068, 0.075, 0.185);
      leftBrow.rotation.z = 0.1;
      headGroup.add(leftBrow);

      const rightBrowGeo = new THREE.BoxGeometry(0.065, 0.016, 0.02);
      const rightBrow = new THREE.Mesh(rightBrowGeo, hairMat);
      rightBrow.position.set(0.068, 0.075, 0.185);
      rightBrow.rotation.z = -0.1;
      headGroup.add(rightBrow);

      // Modern Styled Hair (Layered Volumetric Haircut)
      const hairMainGeo = new THREE.SphereGeometry(0.21, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const hairMain = new THREE.Mesh(hairMainGeo, hairMat);
      hairMain.position.set(0, 0.05, -0.01);
      hairMain.rotation.x = -0.15;
      headGroup.add(hairMain);

      // Textured Pompadour Volume Top
      const hairTopGeo = new THREE.SphereGeometry(0.18, 16, 14);
      const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
      hairTop.scale.set(0.9, 0.65, 1.15);
      hairTop.position.set(0, 0.18, 0.03);
      hairTop.rotation.x = 0.18;
      headGroup.add(hairTop);

      // Styled Side-Sweep Fringe
      const fringeGeo = new THREE.BoxGeometry(0.18, 0.06, 0.07);
      const fringe = new THREE.Mesh(fringeGeo, hairMat);
      fringe.position.set(-0.02, 0.16, 0.16);
      fringe.rotation.z = 0.12;
      fringe.rotation.x = 0.25;
      headGroup.add(fringe);

      // Sideburns
      const leftSideburn = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 0.03), hairMat);
      leftSideburn.position.set(-0.18, 0.01, 0.08);
      headGroup.add(leftSideburn);

      const rightSideburn = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 0.03), hairMat);
      rightSideburn.position.set(0.18, 0.01, 0.08);
      headGroup.add(rightSideburn);

      upperBodyGroup.add(headGroup);

      // ==================== ARTICULATED 5-FINGER HUMAN HAND ====================
      const createDetailedHumanHand = (isLeft) => {
        const handGroup = new THREE.Group();
        const sign = isLeft ? -1 : 1;

        // Palm (Carpal/Metacarpal contoured shape)
        const palmGeo = new THREE.BoxGeometry(0.09, 0.095, 0.03);
        const palm = new THREE.Mesh(palmGeo, skinMat);
        handGroup.add(palm);

        // Thenar Eminence (Thumb base muscle pad)
        const thenarGeo = new THREE.SphereGeometry(0.024, 10, 10);
        const thenar = new THREE.Mesh(thenarGeo, skinMat);
        thenar.position.set(sign * 0.038, 0.01, 0.01);
        handGroup.add(thenar);

        // 4 Articulated Fingers (Knuckle + Proximal + Distal phalanges)
        const fingerNodes = [];
        const fingerLengths = [0.035, 0.04, 0.036, 0.028]; // Index, Middle, Ring, Pinky
        const xPositions = [-0.032, -0.011, 0.011, 0.032];

        for (let i = 0; i < 4; i++) {
          const xPos = isLeft ? -xPositions[i] : xPositions[i];
          const knuckle = new THREE.Group();
          knuckle.position.set(xPos, -0.05, 0);

          // Proximal Phalanx
          const proxGeo = new THREE.CylinderGeometry(0.01, 0.009, fingerLengths[i], 8);
          const prox = new THREE.Mesh(proxGeo, skinMat);
          prox.position.y = -fingerLengths[i] * 0.5;
          knuckle.add(prox);

          // Intermediate Knuckle Joint
          const midJoint = new THREE.Group();
          midJoint.position.y = -fingerLengths[i];
          knuckle.add(midJoint);

          // Distal Phalanx & Tip
          const distGeo = new THREE.CylinderGeometry(0.0085, 0.007, fingerLengths[i] * 0.8, 8);
          const dist = new THREE.Mesh(distGeo, skinMat);
          dist.position.y = -fingerLengths[i] * 0.4;
          midJoint.add(dist);

          // Fingernail
          const nailGeo = new THREE.BoxGeometry(0.008, 0.01, 0.002);
          const nail = new THREE.Mesh(nailGeo, nailMat);
          nail.position.set(0, -fingerLengths[i] * 0.6, 0.008);
          midJoint.add(nail);

          handGroup.add(knuckle);
          fingerNodes.push({ knuckle, midJoint });
        }

        // Opposable Human Thumb
        const thumbBase = new THREE.Group();
        thumbBase.position.set(sign * 0.045, -0.01, 0.01);
        thumbBase.rotation.z = sign * -0.65;
        thumbBase.rotation.y = sign * 0.35;

        const thumbProx = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.0095, 0.032, 8), skinMat);
        thumbProx.position.y = -0.016;
        thumbBase.add(thumbProx);

        const thumbMid = new THREE.Group();
        thumbMid.position.y = -0.032;
        thumbBase.add(thumbMid);

        const thumbDist = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.0075, 0.026, 8), skinMat);
        thumbDist.position.y = -0.013;
        thumbMid.add(thumbDist);

        handGroup.add(thumbBase);

        return {
          handGroup,
          fingerNodes, // 0: Index, 1: Middle, 2: Ring, 3: Pinky
          thumb: { thumbBase, thumbMid }
        };
      };

      // ==================== ARMS & SHOULDER JOINTS ====================
      // Right Arm (Primary signing arm)
      const rightShoulder = new THREE.Group();
      rightShoulder.position.set(0.38, 0.42, 0);

      // Deltoid Shoulder Cap
      const rightDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.088, 14, 14), jacketMat);
      rightShoulder.add(rightDeltoid);

      // Upper Arm (Bicep / Tricep)
      const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.32, 16), jacketMat);
      rightUpperArm.position.y = -0.16;
      rightShoulder.add(rightUpperArm);

      // Elbow Joint
      const rightElbow = new THREE.Group();
      rightElbow.position.y = -0.32;
      const rightElbowCap = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), jacketMat);
      rightElbow.add(rightElbowCap);
      rightShoulder.add(rightElbow);

      // Forearm
      const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.05, 0.3, 16), skinMat);
      rightForearm.position.y = -0.15;
      rightElbow.add(rightForearm);

      // Wrist Joint & Hand
      const rightWrist = new THREE.Group();
      rightWrist.position.y = -0.3;
      const rightHandObj = createDetailedHumanHand(false);
      rightWrist.add(rightHandObj.handGroup);
      rightElbow.add(rightWrist);

      upperBodyGroup.add(rightShoulder);

      // Left Arm
      const leftShoulder = new THREE.Group();
      leftShoulder.position.set(-0.38, 0.42, 0);

      const leftDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.088, 14, 14), jacketMat);
      leftShoulder.add(leftDeltoid);

      const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.32, 16), jacketMat);
      leftUpperArm.position.y = -0.16;
      leftShoulder.add(leftUpperArm);

      const leftElbow = new THREE.Group();
      leftElbow.position.y = -0.32;
      const leftElbowCap = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), jacketMat);
      leftElbow.add(leftElbowCap);
      leftShoulder.add(leftElbow);

      // Left Forearm
      const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.05, 0.3, 16), skinMat);
      leftForearm.position.y = -0.15;
      leftElbow.add(leftForearm);

      // Left Wrist with Courier Smart Watch
      const leftWrist = new THREE.Group();
      leftWrist.position.y = -0.3;

      const watchRing = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 10, 20), watchMat);
      watchRing.rotation.x = Math.PI / 2;
      watchRing.position.y = 0.04;
      leftWrist.add(watchRing);

      const watchScreen = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.015, 0.04), watchScreenMat);
      watchScreen.position.set(0, 0.04, 0.058);
      leftWrist.add(watchScreen);

      const leftHandObj = createDetailedHumanHand(true);
      leftWrist.add(leftHandObj.handGroup);
      leftElbow.add(leftWrist);

      upperBodyGroup.add(leftShoulder);
      avatarGroup.add(upperBodyGroup);

      // ==================== STUDIO HI-TECH PODIUM ====================
      const podiumGroup = new THREE.Group();
      podiumGroup.position.y = -0.12;

      // Stage Base Platform
      const stageGeo = new THREE.CylinderGeometry(0.95, 1.05, 0.12, 36);
      const stageMat = new THREE.MeshStandardMaterial({
        color: 0x090e17,
        roughness: 0.25,
        metalness: 0.8
      });
      const stage = new THREE.Mesh(stageGeo, stageMat);
      stage.receiveShadow = true;
      podiumGroup.add(stage);

      // Glowing Dynamic Hologram Ring
      const ringGeo = new THREE.RingGeometry(0.85, 0.92, 40);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(avatarAccentColor),
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.065;
      podiumGroup.add(ring);

      // Outer Accent Ring
      const outerRingGeo = new THREE.RingGeometry(1.0, 1.02, 40);
      const outerRingMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
      outerRing.rotation.x = Math.PI / 2;
      outerRing.position.y = 0.063;
      podiumGroup.add(outerRing);

      scene.add(podiumGroup);
      scene.add(avatarGroup);

      // ==================== MOUSE INTERACTION (360° Drag Rotate) ====================
      const handleMouseDown = (e) => {
        isDraggingRef.current = true;
        prevMouseXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      };

      const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const deltaX = clientX - prevMouseXRef.current;
        prevMouseXRef.current = clientX;
        userRotationYRef.current += deltaX * 0.01;
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
      };

      const domElem = renderer.domElement;
      domElem.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      domElem.addEventListener('touchstart', handleMouseDown, { passive: true });
      window.addEventListener('touchmove', handleMouseMove, { passive: true });
      window.addEventListener('touchend', handleMouseUp);

      // ==================== PROCEDURAL SIGN ANIMATION ENGINE ====================
      const startTime = Date.now();

      // Reset fingers helper
      const setFingersCurl = (handObj, curlAmount) => {
        handObj.fingerNodes.forEach((f) => {
          f.knuckle.rotation.x = curlAmount;
          f.midJoint.rotation.x = curlAmount * 0.8;
        });
      };

      const animate = () => {
        animReqRef.current = requestAnimationFrame(animate);
        const elapsed = (Date.now() - startTime) * 0.001 * signSpeed;

        // Apply user drag rotation
        avatarGroup.rotation.y = userRotationYRef.current;

        // Podium ring slow rotation
        ring.rotation.z = elapsed * 0.25;
        outerRing.rotation.z = -elapsed * 0.15;

        // 1. Natural Human Living Breathing Motion
        const breath = Math.sin(elapsed * 2.2);
        chest.scale.set(1.08 + breath * 0.015, 1, 0.82 + breath * 0.018);
        upperBodyGroup.position.y = 0.75 + breath * 0.006;
        headGroup.position.y = 0.88 + breath * 0.004;

        // 2. Realistic Human Eye Blinking Cycle (Blinks every ~3.5s for 150ms)
        const blinkTime = elapsed % 3.6;
        if (blinkTime > 3.42 && blinkTime < 3.58) {
          leftEyelidGroup.rotation.x = Math.PI * 0.45;
          rightEyelidGroup.rotation.x = Math.PI * 0.45;
        } else {
          leftEyelidGroup.rotation.x = 0;
          rightEyelidGroup.rotation.x = 0;
        }

        // Default finger state (natural human relaxed curve)
        setFingersCurl(rightHandObj, 0.25);
        setFingersCurl(leftHandObj, 0.25);
        rightWrist.rotation.set(0, 0, 0);
        leftWrist.rotation.set(0, 0, 0);
        leftBrow.position.y = 0.075;
        rightBrow.position.y = 0.075;
        headGroup.rotation.set(0, 0, 0);

        // 3. ASL Sign Language Execution Sequences
        if (resolvedKey === "HELLO") {
          setCurrentFrameText("Touching temple ➔ Sweeping outward in ASL salute 👋");
          // Friendly head tilt & raised eyebrow
          headGroup.rotation.y = 0.08 + Math.sin(elapsed * 2) * 0.04;
          headGroup.rotation.z = -0.04;
          rightBrow.position.y = 0.088;
          leftBrow.position.y = 0.088;

          // Right arm raises to temple and sweeps outward
          const t = Math.sin(elapsed * 3.5);
          rightShoulder.rotation.x = -1.35 + t * 0.25;
          rightShoulder.rotation.z = -0.7 + t * 0.2;
          rightShoulder.rotation.y = 0.35;
          rightElbow.rotation.x = -1.1;
          rightElbow.rotation.y = 0.4 + t * 0.3;
          rightWrist.rotation.z = 0.2 + t * 0.25;

          // Open flat five-finger palm
          setFingersCurl(rightHandObj, 0.05);

          // Left arm relaxed at hip
          leftShoulder.rotation.set(0.1, 0, 0.2);
          leftElbow.rotation.set(-0.25, 0, 0);

        } else if (resolvedKey === "LEAVE AT DOOR") {
          setCurrentFrameText("Palms flat down ➔ Lowering gracefully to doorstep 🚪");
          // Attentive nod towards the doorstep
          headGroup.rotation.x = 0.12 + Math.sin(elapsed * 2) * 0.05;

          const wave = Math.sin(elapsed * 3);
          // Both arms press down with flat palms
          rightShoulder.rotation.x = -0.85 + wave * 0.22;
          rightShoulder.rotation.z = -0.25;
          rightElbow.rotation.x = -1.0 + wave * 0.25;
          rightWrist.rotation.x = 0.8; // Palms facing down

          leftShoulder.rotation.x = -0.85 + wave * 0.22;
          leftShoulder.rotation.z = 0.25;
          leftElbow.rotation.x = -1.0 + wave * 0.25;
          leftWrist.rotation.x = 0.8; // Palms facing down

          setFingersCurl(rightHandObj, 0.1);
          setFingersCurl(leftHandObj, 0.1);

        } else if (resolvedKey === "GATE CODE") {
          setCurrentFrameText("Extending index finger ➔ Tapping virtual keypad digits 🔢");
          headGroup.rotation.x = 0.08;
          headGroup.rotation.y = -0.05;
          // Focused eyebrows
          rightBrow.position.y = 0.07;
          leftBrow.position.y = 0.07;

          // Right arm raised, index finger tapping distinct keys in air
          const tap = Math.sin(elapsed * 9);
          rightShoulder.rotation.x = -1.25;
          rightShoulder.rotation.z = -0.2;
          rightElbow.rotation.x = -0.9 + tap * 0.12;
          rightElbow.rotation.y = Math.sin(elapsed * 4.5) * 0.25; // Shifts between digits

          // Articulate Index Finger (Straight) vs Curled others
          rightHandObj.fingerNodes[0].knuckle.rotation.x = -0.15; // Index straight
          rightHandObj.fingerNodes[0].midJoint.rotation.x = -0.05;
          for (let f = 1; f < 4; f++) {
            rightHandObj.fingerNodes[f].knuckle.rotation.x = 1.35; // Curled into fist
            rightHandObj.fingerNodes[f].midJoint.rotation.x = 1.2;
          }
          rightHandObj.thumb.thumbBase.rotation.x = 0.7;

          // Left arm supporting
          leftShoulder.rotation.set(-0.35, 0, 0.25);
          leftElbow.rotation.set(-0.7, 0, 0);

        } else if (resolvedKey === "FOOD PICKED UP") {
          setCurrentFrameText("Cradling thermal bag ➔ Lifting safely to chest 🛍️");
          headGroup.rotation.x = 0.05;
          const lift = Math.sin(elapsed * 2.5);

          // Both arms curve in to hold bag and lift
          rightShoulder.rotation.x = -0.65 + lift * 0.3;
          rightShoulder.rotation.z = -0.38;
          rightElbow.rotation.x = -1.25;
          rightWrist.rotation.z = -0.4;

          leftShoulder.rotation.x = -0.65 + lift * 0.3;
          leftShoulder.rotation.z = 0.38;
          leftElbow.rotation.x = -1.25;
          leftWrist.rotation.z = 0.4;

          // Cupped hands
          setFingersCurl(rightHandObj, 0.45);
          setFingersCurl(leftHandObj, 0.45);

        } else if (resolvedKey === "I AM OUTSIDE") {
          setCurrentFrameText("Index finger pointing forward ➔ Directing to entrance 📍");
          headGroup.rotation.y = Math.sin(elapsed * 3) * 0.08;
          rightBrow.position.y = 0.085;

          const pointTap = Math.sin(elapsed * 6);
          rightShoulder.rotation.x = -1.15 + pointTap * 0.12;
          rightShoulder.rotation.z = -0.12;
          rightElbow.rotation.x = -0.65;

          // Pointing finger
          rightHandObj.fingerNodes[0].knuckle.rotation.x = -0.2;
          rightHandObj.fingerNodes[0].midJoint.rotation.x = 0;
          for (let f = 1; f < 4; f++) {
            rightHandObj.fingerNodes[f].knuckle.rotation.x = 1.3;
            rightHandObj.fingerNodes[f].midJoint.rotation.x = 1.1;
          }

          leftShoulder.rotation.set(0.1, 0, 0.18);
          leftElbow.rotation.set(-0.3, 0, 0);

        } else if (resolvedKey === "TRAFFIC DELAY") {
          setCurrentFrameText("Alternating undulating hands ➔ Congestion waves 🚦");
          headGroup.rotation.y = Math.sin(elapsed * 2) * 0.1;
          headGroup.rotation.x = 0.04;

          const traffic1 = Math.sin(elapsed * 3.8);
          const traffic2 = Math.cos(elapsed * 3.8);

          rightShoulder.rotation.x = -0.8 + traffic1 * 0.25;
          rightShoulder.rotation.z = -0.45;
          rightElbow.rotation.x = -0.9;
          rightWrist.rotation.z = traffic1 * 0.35;

          leftShoulder.rotation.x = -0.8 + traffic2 * 0.25;
          leftShoulder.rotation.z = 0.45;
          leftElbow.rotation.x = -0.9;
          leftWrist.rotation.z = -traffic2 * 0.35;

          setFingersCurl(rightHandObj, 0.2);
          setFingersCurl(leftHandObj, 0.2);

        } else if (resolvedKey === "THANK YOU") {
          setCurrentFrameText("Fingers touch chin ➔ Sweeping forward with appreciation 🙏");
          // Warm nod & smile
          const thanks = Math.sin(elapsed * 3);
          headGroup.rotation.x = 0.08 + Math.max(0, -thanks * 0.12);
          rightBrow.position.y = 0.088;
          leftBrow.position.y = 0.088;

          // Right hand begins at chin and sweeps forward
          rightShoulder.rotation.x = -1.4 + thanks * 0.35;
          rightShoulder.rotation.z = -0.25 + thanks * 0.15;
          rightElbow.rotation.x = -1.35 + thanks * 0.55;
          rightWrist.rotation.x = -thanks * 0.4;

          // Flat grateful open hand
          setFingersCurl(rightHandObj, 0.08);

          leftShoulder.rotation.set(0.12, 0, 0.2);
          leftElbow.rotation.set(-0.25, 0, 0);
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
        domElem.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        domElem.removeEventListener('touchstart', handleMouseDown);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);

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
  }, [resolvedKey, signSpeed, height, reducedMotion, webGlError, avatarAccentColor]);

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
            {resolvedKey}
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
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl group select-none">
      {/* Top Header Badge & Quick Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/40 shadow-lg">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
            Alex &bull; 3D Human ASL Interpreter
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Reset Camera Rotation Button */}
          <button
            onClick={handleResetRotation}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 text-xs px-2.5 py-1.5 rounded-full font-semibold transition flex items-center gap-1 shadow-md"
            title="Reset to Front View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset View</span>
          </button>

          {/* Speed Selector */}
          <button 
            onClick={() => setSignSpeed(signSpeed === 1 ? 1.5 : signSpeed === 1.5 ? 0.5 : 1)}
            className="bg-slate-900/90 hover:bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-xs px-3 py-1.5 rounded-full font-bold transition flex items-center gap-1 shadow-md"
            title="Adjust Animation Speed"
          >
            <FastForward className="w-3.5 h-3.5" />
            {signSpeed}x
          </button>
        </div>
      </div>

      {/* Drag Hint Overlay */}
      <div className="absolute top-12 left-3 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
        <span className="text-[10px] bg-slate-950/80 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
          <Info className="w-3 h-3 text-cyan-400" /> Drag to rotate 360&deg;
        </span>
      </div>

      {/* Three.js 3D Human Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 cursor-grab active:cursor-grabbing" 
        style={{ height }} 
      />

      {/* Subtitle / Phrase Breakdown Banner */}
      <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 flex items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{signData.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-cyan-400 font-extrabold tracking-wider uppercase">Current Gesture</p>
              <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800 font-semibold">
                {signData.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-100">{currentFrameText}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-800 font-extrabold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Full Human Anatomy
          </span>
        </div>
      </div>
    </div>
  );
};
