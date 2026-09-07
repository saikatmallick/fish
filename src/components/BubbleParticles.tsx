import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  size: number;
  speedY: number;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleOffset: number;
  opacity: number;
}

export default function BubbleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Number of bubbles scaled based on screen size
    const bubbleCount = Math.min(65, Math.floor((width * height) / 25000));
    const bubbles: Bubble[] = [];

    // Helper to initialize a bubble
    const createBubble = (isFresh = false): Bubble => {
      return {
        x: Math.random() * width,
        y: isFresh ? Math.random() * height : height + Math.random() * 80 + 20,
        size: Math.random() * 3.5 + 1.2, // Delicate micro-bubble sizes
        speedY: Math.random() * 0.45 + 0.15, // Smooth rising speed
        wobbleSpeed: Math.random() * 1.5 + 0.5,
        wobbleRange: Math.random() * 1.8 + 0.4,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.22 + 0.08, // Subtle transparency
      };
    };

    // Populate initial batch scattered throughout screen height
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(createBubble(true));
    }

    // Handle screen resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic mouse position to push bubbles subtly near the pointer
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Elegant Rendering Loop
    let animationId: number;
    let time = 0;

    const draw = () => {
      time += 0.016; // Stable interval increment equivalent
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach((bubble) => {
        // Rise up
        bubble.y -= bubble.speedY;

        // Elegant sub-aquatic sine wave lateral wobble
        const wobbleX = Math.sin(time * bubble.wobbleSpeed + bubble.wobbleOffset) * bubble.wobbleRange;
        
        let currentX = bubble.x + wobbleX;

        // Subtle repulsion effect from cursor location
        const dx = currentX - mouse.x;
        const dy = bubble.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 140) {
          const force = (140 - distance) / 140;
          const angle = Math.atan2(dy, dx);
          currentX += Math.cos(angle) * force * 1.5;
          bubble.y += Math.sin(angle) * force * 0.8;
        }

        // Draw bubble with luxury glossy highlight and reflection arcs
        ctx.beginPath();
        // Bubble outline
        ctx.arc(currentX, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(164, 230, 255, ${bubble.opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Inner soft glow
        ctx.fillStyle = `rgba(164, 230, 255, ${bubble.opacity * 0.25})`;
        ctx.fill();

        // Highlight glint dot to give 3D spherical depth
        ctx.beginPath();
        ctx.arc(
          currentX - bubble.size * 0.25,
          bubble.y - bubble.size * 0.25,
          bubble.size * 0.15,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 1.2})`;
        ctx.fill();

        // Reset bubble to bottom once exiting the upper layout edge
        if (bubble.y < -20) {
          Object.assign(bubble, createBubble(false));
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
