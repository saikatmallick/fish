import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function FishCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8); // Moved closer for a spectacular centered view

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Refined undersea cinematic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00ffff, 3.0);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const blueLight = new THREE.DirectionalLight(0x4c8cff, 2.5);
    blueLight.position.set(-5, 3, 2);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xff00ff, 3.5, 20);
    pinkLight.position.set(0, -2, 3);
    scene.add(pinkLight);

    // Load the GLTF/GLB model
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;
    let fishGroup: THREE.Group | null = null;
    let model: THREE.Object3D | null = null;

    // Scroll and Movement Kinetics
    let lastScrollY = window.scrollY;
    let smoothedScrollY = window.scrollY;
    let scrollVelocity = 0;
    let activeSwimSpeed = 0.05;

    // DOM Elements for dynamic height mapping
    let sanctuaryEl: HTMLElement | null = null;
    let experiencesEl: HTMLElement | null = null;
    let descentEl: HTMLElement | null = null;
    let inquiryEl: HTMLElement | null = null;
    
    let currentX = 0;
    let currentY = 0;
    let currentZ = 0;
    let currentRotX = 0;
    let currentRotY = -Math.PI / 2;
    let currentRotZ = 0;

    // Interactive Drag and Orientation variables (active at the top)
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let targetDragOffsetX = 0;
    let targetDragOffsetY = 0;
    let hoverOffsetX = 0;
    let hoverOffsetY = 0;
    let targetHoverOffsetX = 0;
    let targetHoverOffsetY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    let lastTime = performance.now();
    const clock = new THREE.Clock();

    loader.load(
      "/fish_rainbow_animated.glb",
      (gltf) => {
        model = gltf.scene;

        // Auto-scale to ensure perfect centered fit
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const desiredScale = 4.2 / maxDim; // Make it prominent in the center
        model.scale.set(desiredScale, desiredScale, desiredScale);

        // Center model geometry perfectly around pivot
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x * desiredScale;
        model.position.y = -center.y * desiredScale;
        model.position.z = -center.z * desiredScale;

        // Create container group
        fishGroup = new THREE.Group();
        fishGroup.add(model);
        scene.add(fishGroup);

        // Play swimming model animation cycle
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
        console.error("Failed to load fish GLB model:", err);
        setError("Unable to render the live 3D creature.");
        setLoading(false);
      }
    );

    // Kinetic Scroll Listener
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      
      const velocity = deltaY / dt;
      scrollVelocity = Math.max(scrollVelocity, velocity);
      
      lastScrollY = window.scrollY;
      lastTime = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pointer Drag Listeners for Interactive Playfulness in Hero Section (scrollY < 120)
    const onPointerDown = (e: PointerEvent) => {
      if (window.scrollY > 120) return;
      isDragging = true;
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      if (window.scrollY > 120) {
        isDragging = false;
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetDragOffsetY += deltaX * 0.007;
      targetDragOffsetX += deltaY * 0.007;

      // Clamp X rotation to prevent flipping upside down
      targetDragOffsetX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetDragOffsetX));

      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // Premium Interactive Hover gaze effect (only at the top of the page within the hero section content area, when not dragging)
    const onGlobalPointerMove = (e: PointerEvent) => {
      if (window.scrollY > 120) {
        targetHoverOffsetX = 0;
        targetHoverOffsetY = 0;
        return;
      }
      
      // Restrict to the main area of the hero section (below header '90px' and above 'innerHeight')
      const isInHeroSection = e.clientY >= 90 && e.clientY <= window.innerHeight;

      if (isInHeroSection && !isDragging) {
        const nx = (e.clientX / window.innerWidth) - 0.5;
        const ny = (e.clientY / window.innerHeight) - 0.5;
        targetHoverOffsetX = ny * 0.42;
        targetHoverOffsetY = nx * 0.42;
      } else {
        targetHoverOffsetX = 0;
        targetHoverOffsetY = 0;
      }
    };
    window.addEventListener("pointermove", onGlobalPointerMove, { passive: true });

    // Smoothly restore default orientation when mouse leaves the browser window of the user
    const onMouseLeave = () => {
      targetHoverOffsetX = 0;
      targetHoverOffsetY = 0;
    };
    document.addEventListener("mouseleave", onMouseLeave);

    // WebGL Loop
    let requestID: number;
    const animate = () => {
      requestID = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smoothly interpolate scroll coordinate inside continuous RAF with enhanced damping
      smoothedScrollY += (window.scrollY - smoothedScrollY) * 0.045;

      // Decay kinetic energy for reactive scroll-based speed
      scrollVelocity *= 0.93;
      activeSwimSpeed += (scrollVelocity * 1.4 - activeSwimSpeed) * 0.08;
      
      // Strict scroll-dependent playrate.
      // If we are still in the hero section at the top, let's keep a gentle, natural constant swimming animation (speed of 0.65).
      // Once we scroll, we transition swim speed dynamically but capped elegantly so it does not wiggle/shake rapidly.
      const baseRestingSpeed = window.scrollY < 20 ? 0.65 : 0.04;
      const finalSwimSpeed = Math.max(baseRestingSpeed, Math.min(1.0, activeSwimSpeed));

      if (mixer) {
        mixer.update(delta * finalSwimSpeed);
      }

      // Decay manual dragging offsets when scrolling takes place or when not actively dragging
      if (window.scrollY > 120) {
        isDragging = false;
        targetDragOffsetX += (0 - targetDragOffsetX) * 0.12;
        targetDragOffsetY += (0 - targetDragOffsetY) * 0.12;
      } else if (!isDragging) {
        // Automatically smoothly return to original resting orientation when not dragging
        targetDragOffsetX += (0 - targetDragOffsetX) * 0.05;
        targetDragOffsetY += (0 - targetDragOffsetY) * 0.05;
      }

      dragOffsetX += (targetDragOffsetX - dragOffsetX) * 0.08;
      dragOffsetY += (targetDragOffsetY - dragOffsetY) * 0.08;

      // Smoothly interpolate and decay hover gaze values
      if (window.scrollY > 120) {
        targetHoverOffsetX = 0;
        targetHoverOffsetY = 0;
      }
      hoverOffsetX += (targetHoverOffsetX - hoverOffsetX) * 0.08;
      hoverOffsetY += (targetHoverOffsetY - hoverOffsetY) * 0.08;

      // Update Cursor directly through DOM to prevent React re-render overhead
      if (container) {
        if (window.scrollY < 120) {
          container.style.cursor = isDragging ? "grabbing" : "grab";
        } else {
          container.style.cursor = "default";
        }
      }

      if (fishGroup) {
        const H = window.innerHeight || 800;
        const aspect = width / height;
        // Map dynamic horizontal boundary based on display width ratio
        const xLimit = Math.min(6.5, Math.max(4.0, aspect * 3.2));

        // Locate DOM elements for dynamic tracking if not cached yet
        if (!sanctuaryEl) sanctuaryEl = document.getElementById("sanctuary-section");
        if (!experiencesEl) experiencesEl = document.getElementById("experiences-section");
        if (!descentEl) descentEl = document.getElementById("descent-simulator-section");
        if (!inquiryEl) inquiryEl = document.getElementById("inquiry-section");

        // Calculate absolute top coordinates or fallback to standard H multiples
        const sanctuaryTop = sanctuaryEl ? (sanctuaryEl.getBoundingClientRect().top + window.scrollY) : (1.6 * H);
        const experiencesTop = experiencesEl ? (experiencesEl.getBoundingClientRect().top + window.scrollY) : (3.0 * H);
        const descentTop = descentEl ? (descentEl.getBoundingClientRect().top + window.scrollY) : (4.4 * H);
        const inquiryTop = inquiryEl ? (inquiryEl.getBoundingClientRect().top + window.scrollY) : (5.8 * H);

        let targetX = 0;
        let targetY = 0;
        let targetZ = 0;
        let targetRotX = dragOffsetX + hoverOffsetX;
        let targetRotY = -Math.PI / 2 + dragOffsetY + hoverOffsetY;
        let targetRotZ = 0;
        let targetOpacity = 1;

        // Journey B thresholds: Silent Descent
        const swimLeftStart = descentTop - 0.4 * H;
        const swimLeftEnd = inquiryTop - 0.25 * H;

        if (smoothedScrollY >= swimLeftStart) {
          // ==========================================
          // JOURNEY B: The Silent Descent (Right-to-Left)
          // ==========================================
          const pB = Math.max(0, Math.min(1, (smoothedScrollY - swimLeftStart) / (swimLeftEnd - swimLeftStart)));

          // Swim from right to left
          targetX = (xLimit + 1.8) - pB * (xLimit * 2 + 3.6);

          // Bobbing & undulation
          const marineBob = Math.sin(elapsed * 1.8) * 0.12;
          const undulation = Math.sin(smoothedScrollY * 0.0028) * 0.3;
          targetY = -0.6 + marineBob + undulation;
          targetZ = -1.8;

          // Yaw facing left, slight reverse pitch & roll
          targetRotX = -Math.cos(smoothedScrollY * 0.0028) * 0.12;
          targetRotY = -Math.PI / 2;
          targetRotZ = -Math.sin(elapsed * 1.8) * 0.05;

          // Opacity control: fade in at start, solid in middle, fade out at end
          if (pB < 0.2) {
            targetOpacity = pB / 0.2;
          } else if (pB <= 0.8) {
            targetOpacity = 1.0;
          } else {
            targetOpacity = Math.max(0, 1.0 - (pB - 0.8) / 0.2);
          }

          if (smoothedScrollY > swimLeftEnd) {
            targetOpacity = 0;
          }
        } else {
          // ==========================================
          // JOURNEY A: Hero & Penthouses/Experiences
          // ==========================================
          if (smoothedScrollY < sanctuaryTop) {
            // PHASE 1: Downward Plunge Dive from center to bottom-left entrance point
            const p1 = Math.max(0, Math.min(1, smoothedScrollY / sanctuaryTop));
            
            targetX = p1 * -xLimit;
            targetY = p1 * -1.4;
            targetZ = p1 * -1.8;
            
            // Fully downward dive head-pointing slope (up to ~75 degrees) with a smooth level-out at the end
            let plungeIncline = 0;
            if (p1 < 0.82) {
              plungeIncline = Math.sin((p1 / 0.82) * Math.PI * 0.5) * 1.35;
            } else {
              const t = (p1 - 0.82) / 0.18;
              plungeIncline = (1.0 - Math.sin(t * Math.PI * 0.5)) * 1.35;
            }
            targetRotX = dragOffsetX + hoverOffsetX + plungeIncline;
            
            // Smooth 180° rotation from facing left (-90°) to facing right (90°)
            targetRotY = -Math.PI / 2 + dragOffsetY + hoverOffsetY + (p1 * Math.PI);
            
            // Elegant rolling yaw tilt representing organic banking action
            targetRotZ = Math.sin(p1 * Math.PI) * 0.38;
          } else {
            // PHASE 2: Horizontal Left-to-Right migration crossing the sanctuary/experiences sections
            const swimRightStart = sanctuaryTop;
            const swimRightEnd = descentTop - 0.6 * H;
            const p2 = Math.max(0, Math.min(1, (smoothedScrollY - swimRightStart) / (swimRightEnd - swimRightStart)));
            
            targetX = -xLimit + p2 * (xLimit * 2 + 1.8);
            
            // Natural aquatic level bobbing + scroll-undulation
            const marineBob = Math.sin(elapsed * 1.8) * 0.12;
            const undulation = Math.sin(smoothedScrollY * 0.0028) * 0.3;
            targetY = -1.4 + marineBob + undulation;
            targetZ = -1.8;
            
            // Subtle pitch based on up/down wave curves
            targetRotX = Math.cos(smoothedScrollY * 0.0028) * 0.12;
            // Level yaw facing right
            targetRotY = Math.PI / 2;
            // Tiny tail trailing tilt
            targetRotZ = Math.sin(elapsed * 1.8) * 0.05;

            // PHASE 3: Seamless Out-of-Screen fading past the experiences segment
            if (smoothedScrollY > swimRightEnd - 0.3 * H) {
              const fadeStart = swimRightEnd - 0.3 * H;
              const fp = Math.max(0, Math.min(1, (smoothedScrollY - fadeStart) / (0.3 * H)));
              targetOpacity = 1 - fp;
            }
          }
        }

        // Apply smooth interpolation (inertial damping) for high-end cinematic feel
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        currentZ += (targetZ - currentZ) * 0.05;
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;
        currentRotZ += (targetRotZ - currentRotZ) * 0.05;

        fishGroup.position.set(currentX, currentY, currentZ);
        fishGroup.rotation.set(currentRotX, currentRotY, currentRotZ);

        // Instant background opacity update
        if (container) {
          container.style.opacity = targetOpacity.toFixed(3);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Auto resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        width = newW;
        height = newH;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(requestID);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointermove", onGlobalPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-brand-bg/20 backdrop-blur-sm z-30 font-mono text-xs text-brand-primary/60">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-20 transition-opacity duration-1000 ${
        loading ? "opacity-0" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
