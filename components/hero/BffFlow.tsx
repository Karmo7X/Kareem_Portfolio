'use client';

import { useEffect, useRef } from 'react';

/**
 * Live diagram of the BFF pattern from ChinaParts / Petrobe / CentriX:
 * requests (copper) travel client → Next.js route handler → Laravel API,
 * responses (cream) travel back. Click to fire a burst of requests.
 */

const NODES = ['CLIENT', 'NEXT BFF', 'LARAVEL API'];
const NODE_X = [0.17, 0.5, 0.83];
// Leg k of a round trip runs FROM[k] → TO[k]; legs 0–1 are the request, 2–3 the response.
const FROM = [0, 1, 2, 1];
const TO = [1, 2, 1, 0];
const LANE = 9;

const C = {
  grid: 'rgba(255,255,255,0.06)',
  lane: 'rgba(255,255,255,0.14)',
  guide: 'rgba(255,255,255,0.06)',
  radar: 'rgba(252,155,99,0.30)',
  radarInner: 'rgba(252,155,99,0.14)',
  node: '#141313',
  nodeLine: '#3a3836',
  label: '#9a9791',
  copper: '#cf8047',
  cream: '#fbfbfa',
  sand: '#ffb68e',
};

type Packet = { s: number; speed: number };

type BffFlowProps = {
  /** Accessible description of the diagram. */
  label: string;
  /** "Click to send requests" hint, drawn on the start edge. */
  hint: string;
  rtl?: boolean;
  className?: string;
};

export function BffFlow({ label, hint, rtl = false, className }: BffFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mono = getComputedStyle(canvas).fontFamily;
    const packets: Packet[] = [0.35, 1.2, 2.55, 3.4].map((s) => ({ s, speed: 0.6 }));
    const flash = [0, 0, 0];
    const pointer = { x: 0, y: 0, on: false };
    let w = 0;
    let h = 0;
    let spawnIn = 0.6;
    let last = 0;
    let frame = 0;
    let running = false;
    let visible = false;

    const nx = (i: number) => NODE_X[i] * w;
    const midY = () => Math.round(h * 0.36);

    const pos = (s: number) => {
      const leg = Math.min(3, Math.floor(s));
      const t = s - leg;
      const x0 = nx(FROM[leg]);
      return { x: x0 + (nx(TO[leg]) - x0) * t, y: midY() + (leg < 2 ? -LANE : LANE), req: leg < 2 };
    };

    const draw = () => {
      const y = midY();
      const now = performance.now() / 1000;
      ctx.clearRect(0, 0, w, h);

      // Dot grid.
      ctx.fillStyle = C.grid;
      for (let gx = 12; gx < w; gx += 24) for (let gy = 12; gy < h; gy += 24) ctx.fillRect(gx, gy, 1, 1);

      // Radar rings + crosshair around the BFF node.
      const r = Math.min(w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = C.radar;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = reduce ? 0 : -now * 6;
      ctx.beginPath();
      ctx.arc(nx(1), y, r * 0.36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = C.radarInner;
      ctx.beginPath();
      ctx.arc(nx(1), y, r * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = C.guide;
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.moveTo(nx(1) + 0.5, 0);
      ctx.lineTo(nx(1) + 0.5, h);
      ctx.stroke();

      // Request / response lanes.
      ctx.strokeStyle = C.lane;
      ctx.beginPath();
      for (const off of [-LANE, LANE]) {
        ctx.moveTo(nx(0), y + off + 0.5);
        ctx.lineTo(nx(2), y + off + 0.5);
      }
      ctx.stroke();

      ctx.font = `500 9px ${mono}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = C.label;
      ctx.fillText('COOKIE · HTTPONLY', (nx(0) + nx(1)) / 2, y - 26);
      ctx.fillText('TOKEN · SERVER-ONLY', (nx(1) + nx(2)) / 2, y - 26);

      // Packets, with a short trail on the same leg.
      for (const p of packets) {
        const head = pos(p.s);
        const tail = pos(Math.max(Math.floor(p.s), p.s - 0.08));
        ctx.fillStyle = head.req ? C.copper : C.cream;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(Math.min(tail.x, head.x), head.y - 1, Math.abs(head.x - tail.x), 2);
        ctx.globalAlpha = 1;
        ctx.fillRect(head.x - 2.5, head.y - 2.5, 5, 5);
      }

      // Nodes (drawn over the lanes so packets appear to enter them).
      NODES.forEach((label, i) => {
        const x = nx(i);
        const bw = Math.ceil(ctx.measureText(label).width) + 18;
        const bh = 30;
        if (flash[i] > 0) {
          ctx.fillStyle = `rgba(207,128,71,${0.25 * flash[i]})`;
          ctx.fillRect(x - bw / 2 - 5, y - bh / 2 - 5, bw + 10, bh + 10);
        }
        ctx.fillStyle = C.node;
        ctx.fillRect(x - bw / 2, y - bh / 2, bw, bh);
        ctx.strokeStyle = i === 1 ? C.copper : C.nodeLine;
        ctx.strokeRect(Math.round(x - bw / 2) + 0.5, y - bh / 2 + 0.5, bw - 1, bh - 1);
        ctx.fillStyle = i === 1 ? C.cream : C.label;
        ctx.fillText(label, x, y + 0.5);
      });

      if (!reduce) {
        ctx.textAlign = rtl ? 'right' : 'left';
        ctx.fillStyle = C.label;
        ctx.fillText(hint, rtl ? w - 12 : 12, 16);
      }

      // Pointer telemetry, relative to the BFF node.
      if (pointer.on) {
        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(pointer.x + 0.5, 0);
        ctx.lineTo(pointer.x + 0.5, h);
        ctx.moveTo(0, pointer.y + 0.5);
        ctx.lineTo(w, pointer.y + 0.5);
        ctx.stroke();
        ctx.setLineDash([]);
        const flip = pointer.x > w - 110;
        ctx.textAlign = flip ? 'right' : 'left';
        ctx.fillStyle = C.sand;
        ctx.fillText(
          `x:${Math.round(pointer.x - nx(1))} y:${Math.round(y - pointer.y)}`,
          pointer.x + (flip ? -8 : 8),
          pointer.y - 9,
        );
      }
    };

    const step = (dt: number) => {
      spawnIn -= dt;
      if (spawnIn <= 0) {
        packets.push({ s: 0, speed: 0.55 + Math.random() * 0.25 });
        spawnIn = 0.9 + Math.random() * 0.7;
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        const leg = Math.floor(p.s);
        p.s += p.speed * dt;
        if (Math.floor(p.s) !== leg) flash[TO[leg]] = 1;
        if (p.s >= 4) packets.splice(i, 1);
      }
      for (let i = 0; i < flash.length; i++) flash[i] = Math.max(0, flash[i] - dt * 2.2);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !visible) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.on = true;
      if (!running) draw();
    };
    const onLeave = () => {
      pointer.on = false;
      if (!running) draw();
    };
    const onDown = () => {
      if (reduce) return;
      [0.95, 1.1, 1.25].forEach((speed) => packets.push({ s: 0, speed }));
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    // Redraw once the mono webfont lands (matters when the loop isn't running).
    document.fonts?.ready.then(() => !running && draw());

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
    };
  }, [hint, rtl]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      // The diagram is a left-to-right data flow in both languages.
      dir="ltr"
      className={`cursor-crosshair font-mono ${className ?? ''}`}
    />
  );
}
