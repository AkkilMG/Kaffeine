'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let isDark = document.documentElement.classList.contains('dark');
    let color = isDark ? '255,255,255' : '0,0,0';

    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    const particles: Particle[] = [];
    let raf = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      particles.length = 0;
      const count = Math.min(50, Math.floor(w / 25));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.2 + 0.4,
          a: Math.random() * 0.3 + 0.1,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const f = ((120 - dist) / 120) * 0.4;
          if (dist > 0.1) {
            p.vx += (dx / dist) * f;
            p.vy += (dy / dist) * f;
          }
        }

        p.vx *= 0.97;
        p.vy *= 0.97;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color},${p.a})`;
        ctx!.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 100) {
            const alpha = (1 - dist2 / 100) * 0.08;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = `rgba(${color},${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    const themeObserver = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      if (dark !== isDark) {
        isDark = dark;
        color = isDark ? '255,255,255' : '0,0,0';
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    resize();
    init();
    draw();

    window.addEventListener('resize', () => { resize(); init(); });
    window.addEventListener('mousemove', (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}
