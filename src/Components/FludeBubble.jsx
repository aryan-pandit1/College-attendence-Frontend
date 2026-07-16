import React, { useEffect, useRef } from "react";

const AmbientAurora = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Soft, diffused color palettes tailored for a clean academic light theme
    const ribbons = [
      { color1: "rgba(99, 102, 241, 0.22)", color2: "rgba(168, 85, 247, 0.08)", speed: 0.008, offset: 0, baseHeight: 0.35 },
      { color1: "rgba(14, 165, 233, 0.18)", color2: "rgba(99, 102, 241, 0.12)", speed: -0.006, offset: 2, baseHeight: 0.45 },
      { color1: "rgba(16, 185, 129, 0.14)", color2: "rgba(6, 182, 212, 0.08)", speed: 0.007, offset: 4, baseHeight: 0.55 },
      { color1: "rgba(236, 72, 153, 0.10)", color2: "rgba(139, 92, 246, 0.10)", speed: -0.005, offset: 1, baseHeight: 0.40 },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      ribbons.forEach((ribbon, index) => {
        ctx.save();
        ctx.beginPath();

        // Create a sweeping linear gradient across the screen
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, ribbon.color1);
        gradient.addColorStop(1, ribbon.color2);
        ctx.fillStyle = gradient;

        // Start drawing from bottom-left corner
        ctx.moveTo(0, canvas.height);

        // Draw fluid, overlapping sine waves across the X axis
        for (let x = 0; x <= canvas.width + 20; x += 20) {
          const wave1 = Math.sin(time * ribbon.speed + (x * 0.002) + ribbon.offset) * 110;
          const wave2 = Math.cos(time * ribbon.speed * 1.3 + (x * 0.003)) * 60;
          const y = (canvas.height * ribbon.baseHeight) + wave1 + wave2;
          ctx.lineTo(x, y);
        }

        // Complete the shape around the bottom right and back to start
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 1, /* Sits at Layer 0 behind your Layer 10 frosted glass cards */
        pointerEvents: "none", /* Ensures clicks pass through to your buttons and links */
        background: "transparent",
      }}
    />
  );
};

export default AmbientAurora;