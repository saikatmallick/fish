import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface LuminaFishCanvasProps {
  activeExpId: string;
}

export default function LuminaFishCanvas({ activeExpId }: LuminaFishCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep target colors in a mutable ref to avoid triggering React renders
  const targetsRef = useRef({
    ambient: new THREE.Color(0xa4e6ff),
    light1: new THREE.Color(0x00ffff),
    light2: new THREE.Color(0xff00ff)
  });

  // Watch for activeExpId updates and transition color targets smoothly
  useEffect(() => {
    const targets = targetsRef.current;
    if (activeExpId === "exp-01") {
      // Lumina Lounge - Luminous Cyan and Pink highlights
      targets.ambient.setHex(0xa4e6ff);
      targets.light1.setHex(0x00ffff);
      targets.light2.setHex(0xff00ff);
    } else if (activeExpId === "exp-02") {
      // Deep Calm Spa - Royal Purple and Ocean Blue restoration vibes
      targets.ambient.setHex(0xb7c4ff);
      targets.light1.setHex(0x2a52ff);
      targets.light2.setHex(0x8a2be2);
    } else if (activeExpId === "exp-03") {
      // The Abyss Gallery - Energetic Emerald Teal and Cyan highlights
      targets.ambient.setHex(0x9aeae4);
      targets.light1.setHex(0x00ffa3);
      targets.light2.setHex(0x0d5c75);
    }
  }, [activeExpId]);

  // Main mounting effect to initialize WebGL Context and Load Jellyfish once
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Undersea dynamic lights
    const ambientLight = new THREE.AmbientLight(targetsRef.current.ambient, 1.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(targetsRef.current.light1, 3.5);
    cyanLight.position.set(4, 4, 3);
    scene.add(cyanLight);

    const pinkLight = new THREE.PointLight(targetsRef.current.light2, 4.0, 15);
    pinkLight.position.set(-3, -2, 2);
    scene.add(pinkLight);

    // Load Jellyfish once on mount
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;
    let fishGroup: THREE.Group | null = null;
    let model: THREE.Object3D | null = null;

    const clock = new THREE.Clock();

    loader.load(
      "/jellyray.glb",
      (gltf) => {
        model = gltf.scene;

        // Create intermediate pivot group to apply static orientation offset
        // without it being overwritten by the skeletal animation mixer
        const pivotGroup = new THREE.Group();
        pivotGroup.add(model);
        pivotGroup.rotation.z = Math.PI / 2; // Rotate it straight UP (head up, tentacles down)

        const box = new THREE.Box3().setFromObject(pivotGroup);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Vertical prominence scaling (enlarged for beautiful frameless showcase)
        const desiredScale = 3.6 / maxDim;
        pivotGroup.scale.set(desiredScale, desiredScale, desiredScale);

        const center = box.getCenter(new THREE.Vector3());
        pivotGroup.position.x = -center.x * desiredScale;
        pivotGroup.position.y = -center.y * desiredScale;
        pivotGroup.position.z = -center.z * desiredScale;

        // Container group (handles the floating, drifting, and slow 360-degree yaw)
        fishGroup = new THREE.Group();
        fishGroup.add(pivotGroup);
        scene.add(fishGroup);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            action.play();
          });
        }

        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Failed to load jellyray.glb model:", err);
        setError("Unable to render the 3D creature.");
        setLoading(false);
      }
    );

    // WebGL Loop
    let requestID: number;
    const animate = () => {
      requestID = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Play skeletal animation cycles
      if (mixer) {
        mixer.update(delta * 0.75);
      }

      // Smoothly transition lights in WebGL space
      ambientLight.color.lerp(targetsRef.current.ambient, 0.05);
      cyanLight.color.lerp(targetsRef.current.light1, 0.05);
      pinkLight.color.lerp(targetsRef.current.light2, 0.05);

      if (fishGroup) {
        // Weightless Jellyfish floating: vertical bobbing + slow 360° rotation + tiny drift
        fishGroup.position.y = Math.sin(elapsed * 0.7) * 0.22; // smooth deep swells
        fishGroup.position.x = Math.sin(elapsed * 0.4) * 0.08; // light tide drift
        fishGroup.position.z = Math.cos(elapsed * 0.4) * 0.04;
        
        // Slower continuous yaw rotation to display translucent elements 360 degrees
        fishGroup.rotation.y = elapsed * 0.06;
        
        // Gentle zero-gravity wobble/roll
        fishGroup.rotation.z = Math.sin(elapsed * 0.7) * 0.04;
        fishGroup.rotation.x = Math.cos(elapsed * 0.7) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Auto resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(requestID);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-brand-bg/10 backdrop-blur-sm z-30 font-mono text-xs text-brand-primary/50">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-5 transition-opacity duration-1000 ${
        loading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background radial highlight glow matching the active experience colors */}
      <div 
        style={{
          background: activeExpId === "exp-01" 
            ? "radial-gradient(circle, rgba(0,209,255,0.15) 0%, transparent 70%)" 
            : activeExpId === "exp-02"
            ? "radial-gradient(circle, rgba(138,43,226,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0,255,163,0.12) 0%, transparent 70%)",
        }}
        className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0" 
      />
      <canvas ref={canvasRef} className="w-full h-full block relative z-10" />
    </div>
  );
}
