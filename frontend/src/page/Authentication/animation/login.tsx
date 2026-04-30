import React, { useEffect, useMemo, useState } from "react";

type NetworkGlobeAnimationProps = {
  className?: string;
};

type ThreatPoint = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  life: number;
  halo: number;
};

type OuterParticle = {
  x: number;
  y: number;
  r: number;
  c: string;
  o: number;
  cls: string;
};

type MicroNode = {
  x: number;
  y: number;
  r: number;
  c: string;
  opacity: number;
};

type CircuitLine = {
  d: string;
  stroke: string;
  opacity: number;
  width: number;
  cls: string;
};

const CENTER_X = 360;
const CENTER_Y = 308;
const GLOBE_RADIUS = 188;

let threatIdSeed = 1;

const HOTSPOTS: Array<[number, number]> = [
  [246, 222],
  [274, 210],
  [302, 232],
  [334, 214],
  [372, 202],
  [410, 208],
  [444, 220],
  [472, 244],

  [230, 266],
  [270, 286],
  [310, 284],
  [350, 278],
  [392, 282],
  [432, 286],
  [470, 302],

  [252, 320],
  [294, 336],
  [338, 346],
  [382, 344],
  [426, 336],
  [472, 344],

  [286, 386],
  [332, 398],
  [384, 392],
  [432, 378],
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const pickRandom = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const clampToGlobe = (x: number, y: number) => {
  const dx = x - CENTER_X;
  const dy = y - CENTER_Y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxRadius = GLOBE_RADIUS - 24;

  if (distance <= maxRadius) {
    return { x, y };
  }

  const ratio = maxRadius / distance;

  return {
    x: CENTER_X + dx * ratio,
    y: CENTER_Y + dy * ratio,
  };
};

const createThreatPoint = (slotIndex = 0): ThreatPoint => {
  const [baseX, baseY] = pickRandom(HOTSPOTS);
  const clamped = clampToGlobe(baseX + rand(-10, 10), baseY + rand(-8, 8));

  return {
    id: threatIdSeed++,
    x: clamped.x,
    y: clamped.y,
    size: rand(3.8, 5.8),
    opacity: rand(0.8, 0.98),
    driftX: rand(-8, 8),
    driftY: rand(-7, 7),
    duration: rand(8.5, 12.5),
    delay: rand(0, 0.8) + slotIndex * 0.55,
    life: rand(10.5, 14.5),
    halo: rand(1.8, 2.6),
  };
};

const createInitialThreats = (): ThreatPoint[] => {
  return [0, 1, 2, 3].map((slot) => createThreatPoint(slot));
};

const NetworkGlobeAnimation: React.FC<NetworkGlobeAnimationProps> = ({
  className = "",
}) => {
  const [threats, setThreats] = useState<ThreatPoint[]>(() =>
    createInitialThreats()
  );

  useEffect(() => {
    const timerIds: number[] = [];

    const schedules = [
      { slot: 0, firstDelay: 7200, interval: 11200 },
      { slot: 1, firstDelay: 9400, interval: 12700 },
      { slot: 2, firstDelay: 11800, interval: 13900 },
      { slot: 3, firstDelay: 14400, interval: 15300 },
    ];

    schedules.forEach(({ slot, firstDelay, interval }) => {
      const timeoutId = window.setTimeout(() => {
        setThreats((prev) =>
          prev.map((item, index) =>
            index === slot ? createThreatPoint(slot) : item
          )
        );

        const intervalId = window.setInterval(() => {
          setThreats((prev) =>
            prev.map((item, index) =>
              index === slot ? createThreatPoint(slot) : item
            )
          );
        }, interval);

        timerIds.push(intervalId);
      }, firstDelay);

      timerIds.push(timeoutId);
    });

    return () => {
      timerIds.forEach((id) => window.clearTimeout(id));
      timerIds.forEach((id) => window.clearInterval(id));
    };
  }, []);

  const outerParticles: OuterParticle[] = useMemo(
    () => [
      { x: 72, y: 100, r: 2.4, c: "#67e8f9", o: 0.66, cls: "argus-star" },
      {
        x: 124,
        y: 182,
        r: 1.8,
        c: "#a5f3fc",
        o: 0.38,
        cls: "argus-star argus-star-2",
      },
      {
        x: 622,
        y: 116,
        r: 2.4,
        c: "#ef4444",
        o: 0.48,
        cls: "argus-star argus-star-3",
      },
      {
        x: 650,
        y: 412,
        r: 2.1,
        c: "#38bdf8",
        o: 0.42,
        cls: "argus-star argus-star-4",
      },
      {
        x: 96,
        y: 456,
        r: 2.0,
        c: "#f87171",
        o: 0.44,
        cls: "argus-star argus-star-2",
      },
      {
        x: 590,
        y: 488,
        r: 1.8,
        c: "#c4b5fd",
        o: 0.34,
        cls: "argus-star argus-star-3",
      },
      {
        x: 612,
        y: 252,
        r: 1.7,
        c: "#ef4444",
        o: 0.4,
        cls: "argus-star argus-star-4",
      },
      {
        x: 130,
        y: 298,
        r: 1.9,
        c: "#f87171",
        o: 0.32,
        cls: "argus-star argus-star-2",
      },
      {
        x: 306,
        y: 84,
        r: 1.5,
        c: "#67e8f9",
        o: 0.28,
        cls: "argus-star argus-star-3",
      },
      {
        x: 474,
        y: 92,
        r: 1.6,
        c: "#93c5fd",
        o: 0.26,
        cls: "argus-star argus-star-4",
      },
      {
        x: 520,
        y: 190,
        r: 1.7,
        c: "#ef4444",
        o: 0.28,
        cls: "argus-star argus-star-3",
      },
      {
        x: 208,
        y: 492,
        r: 1.4,
        c: "#67e8f9",
        o: 0.24,
        cls: "argus-star argus-star-4",
      },
      {
        x: 548,
        y: 74,
        r: 1.6,
        c: "#67e8f9",
        o: 0.22,
        cls: "argus-star argus-star-2",
      },
      {
        x: 182,
        y: 70,
        r: 1.6,
        c: "#ef4444",
        o: 0.22,
        cls: "argus-star argus-star-4",
      },
      {
        x: 672,
        y: 288,
        r: 1.5,
        c: "#60a5fa",
        o: 0.28,
        cls: "argus-star argus-star-2",
      },
      {
        x: 48,
        y: 340,
        r: 1.5,
        c: "#f87171",
        o: 0.24,
        cls: "argus-star argus-star-3",
      },
    ],
    []
  );

  const microNodes: MicroNode[] = useMemo(
    () => [
      { x: 300, y: 240, r: 2.2, c: "#22d3ee", opacity: 0.66 },
      { x: 330, y: 344, r: 1.9, c: "#60a5fa", opacity: 0.52 },
      { x: 410, y: 262, r: 2.1, c: "#38bdf8", opacity: 0.58 },
      { x: 430, y: 360, r: 2.1, c: "#22d3ee", opacity: 0.5 },
      { x: 352, y: 220, r: 2.2, c: "#93c5fd", opacity: 0.58 },
      { x: 492, y: 334, r: 1.9, c: "#818cf8", opacity: 0.5 },
      { x: 278, y: 300, r: 1.5, c: "#67e8f9", opacity: 0.42 },
      { x: 386, y: 234, r: 1.4, c: "#7dd3fc", opacity: 0.4 },
      { x: 456, y: 304, r: 1.4, c: "#60a5fa", opacity: 0.38 },
      { x: 340, y: 386, r: 1.6, c: "#a5f3fc", opacity: 0.38 },
      { x: 252, y: 274, r: 1.6, c: "#22d3ee", opacity: 0.38 },
      { x: 474, y: 250, r: 1.5, c: "#93c5fd", opacity: 0.36 },
      { x: 382, y: 408, r: 1.5, c: "#a5f3fc", opacity: 0.34 },
    ],
    []
  );

  const circuitLines: CircuitLine[] = useMemo(
    () => [
      {
        d: "M42 446 H182",
        stroke: "#67e8f9",
        opacity: 0.34,
        width: 1,
        cls: "argus-data",
      },
      {
        d: "M500 122 H682",
        stroke: "#ef4444",
        opacity: 0.28,
        width: 1,
        cls: "argus-data argus-data-2",
      },
      {
        d: "M488 492 H694",
        stroke: "#38bdf8",
        opacity: 0.28,
        width: 1,
        cls: "argus-data argus-data-3",
      },
      {
        d: "M72 160 H126 V190 H166",
        stroke: "#67e8f9",
        opacity: 0.18,
        width: 1,
        cls: "argus-circuit argus-circuit-1",
      },
      {
        d: "M600 184 H552 V214 H514",
        stroke: "#ef4444",
        opacity: 0.18,
        width: 1,
        cls: "argus-circuit argus-circuit-2",
      },
      {
        d: "M92 388 H142 V420 H188",
        stroke: "#38bdf8",
        opacity: 0.16,
        width: 1,
        cls: "argus-circuit argus-circuit-3",
      },
      {
        d: "M628 388 H572 V426 H524",
        stroke: "#ef4444",
        opacity: 0.16,
        width: 1,
        cls: "argus-circuit argus-circuit-4",
      },
      {
        d: "M188 100 H254 V126 H302",
        stroke: "#67e8f9",
        opacity: 0.14,
        width: 1,
        cls: "argus-circuit argus-circuit-2",
      },
      {
        d: "M540 458 H474 V432 H426",
        stroke: "#ef4444",
        opacity: 0.14,
        width: 1,
        cls: "argus-circuit argus-circuit-4",
      },
    ],
    []
  );

  return (
    <div
      className={[
        "pointer-events-none absolute inset-0 overflow-hidden bg-slate-950",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes argusStarFloat {
            0%, 100% {
              opacity: 0.18;
              transform: translate3d(0, 0, 0);
            }
            50% {
              opacity: 0.82;
              transform: translate3d(0, -8px, 0);
            }
          }

          @keyframes argusGlobeFloat {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(0, -12px, 0) scale(1.02);
            }
          }

          @keyframes argusGlobeTilt {
            0%, 100% {
              transform: rotate(-1.2deg);
            }
            50% {
              transform: rotate(1.5deg);
            }
          }

          @keyframes argusMapDrift {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-330px);
            }
          }

          @keyframes argusArcFlow {
            0% {
              stroke-dashoffset: 360;
              opacity: 0;
            }
            12% {
              opacity: 1;
            }
            76% {
              opacity: 0.72;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 0;
            }
          }

          @keyframes argusRadarSweep {
            0% {
              transform: rotate(0deg);
              opacity: 0.72;
            }
            100% {
              transform: rotate(360deg);
              opacity: 0.72;
            }
          }

          @keyframes argusScanRing {
            0% {
              opacity: 0;
              transform: scale(0.38);
            }
            18% {
              opacity: 0.92;
            }
            72% {
              opacity: 0.12;
            }
            100% {
              opacity: 0;
              transform: scale(1.42);
            }
          }

          @keyframes argusOrbitRotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes argusOrbitReverse {
            0% {
              transform: rotate(360deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }

          @keyframes argusGlowBreath {
            0%, 100% {
              opacity: 0.42;
              transform: scale(1);
            }
            50% {
              opacity: 0.94;
              transform: scale(1.08);
            }
          }

          @keyframes argusScanLine {
            0% {
              transform: translateY(-135%);
              opacity: 0;
            }
            16% {
              opacity: 0.58;
            }
            50% {
              opacity: 0.18;
            }
            100% {
              transform: translateY(135%);
              opacity: 0;
            }
          }

          @keyframes argusDataStream {
            0% {
              transform: translateX(-145%);
              opacity: 0;
            }
            14% {
              opacity: 0.76;
            }
            78% {
              opacity: 0.12;
            }
            100% {
              transform: translateX(145%);
              opacity: 0;
            }
          }

          @keyframes argusCornerFlicker {
            0%, 100% {
              opacity: 0.28;
            }
            50% {
              opacity: 0.9;
            }
          }

          @keyframes argusThreatDrift {
            0% {
              transform: translate(0px, 0px) scale(0.96);
            }
            25% {
              transform: translate(calc(var(--tx) * 0.30), calc(var(--ty) * -0.20)) scale(1.02);
            }
            60% {
              transform: translate(var(--tx), var(--ty)) scale(1.04);
            }
            100% {
              transform: translate(calc(var(--tx) * -0.24), calc(var(--ty) * -0.16)) scale(0.98);
            }
          }

          @keyframes argusThreatLife {
            0% {
              opacity: 0;
              filter: blur(5px);
            }
            14% {
              opacity: 0;
              filter: blur(4px);
            }
            28% {
              opacity: var(--threat-opacity);
              filter: blur(0px);
            }
            64% {
              opacity: var(--threat-opacity);
              filter: blur(0px);
            }
            82% {
              opacity: calc(var(--threat-opacity) * 0.42);
              filter: blur(1px);
            }
            100% {
              opacity: 0;
              filter: blur(5px);
            }
          }

          @keyframes argusThreatCorePulse {
            0%, 100% {
              transform: scale(0.92);
            }
            50% {
              transform: scale(1.34);
            }
          }

          @keyframes argusThreatFlicker {
            0%, 100% {
              opacity: 0.92;
            }
            18% {
              opacity: 0.56;
            }
            34% {
              opacity: 1;
            }
            52% {
              opacity: 0.76;
            }
            70% {
              opacity: 1;
            }
            86% {
              opacity: 0.62;
            }
          }

          @keyframes argusThreatPing {
            0% {
              opacity: 0;
              transform: scale(0.36);
            }
            18% {
              opacity: 0.40;
              transform: scale(0.58);
            }
            68% {
              opacity: 0.08;
              transform: scale(2.75);
            }
            100% {
              opacity: 0;
              transform: scale(3.2);
            }
          }

          @keyframes argusDangerArc {
            0% {
              opacity: 0.18;
              stroke-dashoffset: 120;
            }
            50% {
              opacity: 0.55;
            }
            100% {
              opacity: 0.18;
              stroke-dashoffset: 0;
            }
          }

          @keyframes argusCircuitFlow {
            0% {
              stroke-dashoffset: 120;
              opacity: 0.06;
            }
            45% {
              opacity: 0.42;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 0.08;
            }
          }

          @keyframes argusTracePulse {
            0% {
              stroke-dashoffset: 180;
              opacity: 0;
            }
            28% {
              opacity: 0.62;
            }
            70% {
              opacity: 0.2;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 0;
            }
          }

          @keyframes argusRingBlink {
            0%, 100% {
              opacity: 0.14;
            }
            50% {
              opacity: 0.52;
            }
          }

          @keyframes argusOuterNode {
            0%, 100% {
              opacity: 0.28;
              transform: scale(1);
            }
            50% {
              opacity: 0.86;
              transform: scale(1.18);
            }
          }

          @keyframes argusBackgroundRotate {
            0% {
              transform: rotate(0deg) scale(1);
            }
            100% {
              transform: rotate(360deg) scale(1);
            }
          }

          @keyframes argusSatelliteOrbit {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes argusSatelliteSelfSpin {
            0%, 100% {
              transform: rotate(-10deg) translateY(0);
            }
            50% {
              transform: rotate(10deg) translateY(-2px);
            }
          }

          @keyframes argusSatelliteBlink {
            0%, 100% {
              opacity: 0.35;
            }
            50% {
              opacity: 1;
            }
          }

          @keyframes argusSatelliteBeamPulse {
            0%, 100% {
              opacity: 0.22;
            }
            50% {
              opacity: 0.52;
            }
          }

          @keyframes argusSatelliteBeamSweep {
            0% {
              opacity: 0.06;
              transform: scaleY(0.92);
            }
            50% {
              opacity: 0.36;
              transform: scaleY(1.02);
            }
            100% {
              opacity: 0.06;
              transform: scaleY(0.92);
            }
          }

          @keyframes argusSatellitePing {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            24% {
              opacity: 0.45;
              transform: scale(0.8);
            }
            100% {
              opacity: 0;
              transform: scale(2.4);
            }
          }

          @keyframes argusSatelliteDish {
            0%, 100% {
              transform: rotate(-12deg);
            }
            50% {
              transform: rotate(12deg);
            }
          }

          @keyframes argusSatellitePanelGlow {
            0%, 100% {
              opacity: 0.72;
            }
            50% {
              opacity: 1;
            }
          }

          @keyframes argusSatelliteThruster {
            0%, 100% {
              opacity: 0.24;
              transform: scaleY(0.84);
            }
            50% {
              opacity: 0.86;
              transform: scaleY(1.18);
            }
          }

          @keyframes argusSatelliteTrail {
            0% {
              opacity: 0.06;
              stroke-dashoffset: 160;
            }
            50% {
              opacity: 0.28;
            }
            100% {
              opacity: 0.06;
              stroke-dashoffset: 0;
            }
          }

          @keyframes argusSatelliteCoreBreath {
            0%, 100% {
              opacity: 0.72;
              transform: scale(0.96);
            }
            50% {
              opacity: 1;
              transform: scale(1.08);
            }
          }

          @keyframes argusReticlePulse {
            0%, 100% {
              opacity: 0.12;
              transform: scale(1);
            }
            50% {
              opacity: 0.4;
              transform: scale(1.04);
            }
          }

          @keyframes argusMiniSpin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes argusHudSweep {
            0% {
              transform: translateX(-120%);
              opacity: 0;
            }
            30% {
              opacity: 0.24;
            }
            70% {
              opacity: 0.18;
            }
            100% {
              transform: translateX(120%);
              opacity: 0;
            }
          }

          .argus-globe-float {
            animation: argusGlobeFloat 7s ease-in-out infinite;
            transform-origin: center;
          }

          .argus-globe-tilt {
            animation: argusGlobeTilt 8.5s ease-in-out infinite;
            transform-origin: 360px 308px;
          }

          .argus-map-drift {
            animation: argusMapDrift 19s linear infinite;
          }

          .argus-arc {
            stroke-dasharray: 14 18;
            animation: argusArcFlow 4.6s ease-in-out infinite;
          }

          .argus-arc-2 {
            animation-delay: 0.45s;
            animation-duration: 5.1s;
          }

          .argus-arc-3 {
            animation-delay: 0.9s;
            animation-duration: 5.5s;
          }

          .argus-arc-4 {
            animation-delay: 1.35s;
            animation-duration: 5.9s;
          }

          .argus-arc-5 {
            animation-delay: 1.8s;
            animation-duration: 6.3s;
          }

          .argus-arc-6 {
            animation-delay: 2.25s;
            animation-duration: 6.8s;
          }

          .argus-radar {
            transform-origin: 360px 308px;
            animation: argusRadarSweep 5.7s linear infinite;
          }

          .argus-scan-ring {
            transform-box: fill-box;
            transform-origin: center;
            animation: argusScanRing 3.6s ease-out infinite;
          }

          .argus-scan-ring-2 {
            animation-delay: 0.9s;
          }

          .argus-scan-ring-3 {
            animation-delay: 1.8s;
          }

          .argus-scan-ring-4 {
            animation-delay: 2.7s;
          }

          .argus-orbit {
            transform-origin: 360px 308px;
            animation: argusOrbitRotate 15s linear infinite;
          }

          .argus-orbit-reverse {
            transform-origin: 360px 308px;
            animation: argusOrbitReverse 21s linear infinite;
          }

          .argus-orbit-fast {
            transform-origin: 360px 308px;
            animation: argusOrbitRotate 10.5s linear infinite;
          }

          .argus-glow {
            transform-origin: center;
            animation: argusGlowBreath 5.8s ease-in-out infinite;
          }

          .argus-star {
            animation: argusStarFloat 4.6s ease-in-out infinite;
          }

          .argus-star-2 {
            animation-delay: 0.75s;
          }

          .argus-star-3 {
            animation-delay: 1.5s;
          }

          .argus-star-4 {
            animation-delay: 2.25s;
          }

          .argus-data {
            animation: argusDataStream 7s ease-in-out infinite;
          }

          .argus-data-2 {
            animation-delay: 1.2s;
          }

          .argus-data-3 {
            animation-delay: 2.4s;
          }

          .argus-corner-blink {
            animation: argusCornerFlicker 3.2s ease-in-out infinite;
          }

          .argus-threat-group {
            animation:
              argusThreatLife var(--life) ease-in-out infinite,
              argusThreatDrift var(--dur) ease-in-out infinite alternate;
            animation-delay: var(--delay), var(--delay);
            transform-box: fill-box;
            transform-origin: center;
          }

          .argus-threat-core {
            animation:
              argusThreatCorePulse calc(var(--dur) * 0.62) ease-in-out infinite,
              argusThreatFlicker calc(var(--dur) * 0.48) linear infinite;
            transform-box: fill-box;
            transform-origin: center;
          }

          .argus-threat-ping {
            animation: argusThreatPing calc(var(--life) * 0.74) ease-out infinite;
            animation-delay: calc(var(--delay) + 0.36s);
            transform-box: fill-box;
            transform-origin: center;
          }

          .argus-threat-ping-2 {
            animation-delay: calc(var(--delay) + 1.16s);
          }

          .argus-threat-trace {
            stroke-dasharray: 10 12;
            animation: argusTracePulse var(--life) ease-in-out infinite;
            animation-delay: calc(var(--delay) + 0.3s);
          }

          .argus-danger-arc {
            stroke-dasharray: 10 10;
            animation: argusDangerArc 5.4s linear infinite;
          }

          .argus-circuit {
            stroke-dasharray: 12 12;
            animation: argusCircuitFlow 5.8s linear infinite;
          }

          .argus-circuit-1 {
            animation-delay: 0s;
          }

          .argus-circuit-2 {
            animation-delay: 1.1s;
          }

          .argus-circuit-3 {
            animation-delay: 2.2s;
          }

          .argus-circuit-4 {
            animation-delay: 3.3s;
          }

          .argus-ring-blink {
            animation: argusRingBlink 4.8s ease-in-out infinite;
          }

          .argus-outer-node {
            animation: argusOuterNode 4.4s ease-in-out infinite;
          }

          .argus-outer-node-2 {
            animation-delay: 0.9s;
          }

          .argus-outer-node-3 {
            animation-delay: 1.8s;
          }

          .argus-outer-node-4 {
            animation-delay: 2.7s;
          }

          .argus-bg-rotate {
            transform-origin: 360px 308px;
            animation: argusBackgroundRotate 42s linear infinite;
          }

          .argus-bg-rotate-reverse {
            transform-origin: 360px 308px;
            animation: argusBackgroundRotate 58s linear infinite reverse;
          }

          .argus-satellite-orbit {
            transform-origin: 360px 308px;
            animation: argusSatelliteOrbit 28s linear infinite;
          }

          .argus-satellite-self {
            transform-origin: 360px 84px;
            animation: argusSatelliteSelfSpin 4.8s ease-in-out infinite;
          }

          .argus-satellite-light {
            animation: argusSatelliteBlink 2.3s ease-in-out infinite;
          }

          .argus-satellite-light-2 {
            animation-delay: 1.15s;
          }

          .argus-satellite-beam {
            transform-origin: 360px 308px;
            animation: argusSatelliteBeamPulse 3.2s ease-in-out infinite;
          }

          .argus-satellite-beam-sweep {
            transform-origin: 360px 84px;
            animation: argusSatelliteBeamSweep 4.8s ease-in-out infinite;
          }

          .argus-satellite-ping {
            transform-origin: center;
            animation: argusSatellitePing 3.2s ease-out infinite;
          }

          .argus-satellite-ping-2 {
            animation-delay: 1.4s;
          }

          .argus-satellite-dish {
            transform-origin: 360px 72px;
            animation: argusSatelliteDish 5.2s ease-in-out infinite;
          }

          .argus-satellite-panel {
            animation: argusSatellitePanelGlow 4.4s ease-in-out infinite;
          }

          .argus-satellite-panel-2 {
            animation-delay: 1.1s;
          }

          .argus-satellite-thruster {
            transform-origin: center;
            animation: argusSatelliteThruster 1.8s ease-in-out infinite;
          }

          .argus-satellite-trail {
            stroke-dasharray: 8 12;
            animation: argusSatelliteTrail 6.2s linear infinite;
          }

          .argus-satellite-core {
            transform-origin: 360px 84px;
            animation: argusSatelliteCoreBreath 3.4s ease-in-out infinite;
          }

          .argus-reticle {
            transform-origin: center;
            animation: argusReticlePulse 4s ease-in-out infinite;
          }

          .argus-mini-spin {
            transform-origin: center;
            animation: argusMiniSpin 16s linear infinite;
          }

          .argus-mini-spin-reverse {
            transform-origin: center;
            animation: argusMiniSpin 18s linear infinite reverse;
          }

          .argus-hud-sweep {
            animation: argusHudSweep 7.2s linear infinite;
          }
        `}
      </style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_76%_26%,rgba(120,35,35,0.24),transparent_26%),radial-gradient(circle_at_20%_78%,rgba(110,20,20,0.20),transparent_26%),linear-gradient(180deg,#01030a_0%,#050b17_44%,#01030a_100%)]" />

      <div className="absolute inset-0 opacity-[0.12]">
        <div className="h-full w-full bg-[linear-gradient(rgba(103,232,249,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.10)_1px,transparent_1px)] bg-size-[34px_34px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.06]">
        <div className="h-full w-full bg-[radial-gradient(circle,rgba(248,113,113,0.48)_1px,transparent_1.5px)] bg-size-[46px_46px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.5)_0_1px,transparent_2px),radial-gradient(circle_at_80%_70%,rgba(248,113,113,0.42)_0_1px,transparent_2px)] bg-size-[88px_88px]" />
      </div>
            
      <div
        className="absolute inset-x-0 top-[-28%] h-[48%] bg-linear-to-b from-cyan-300/16 via-sky-300/6 to-transparent blur-2xl"
        style={{ animation: "argusScanLine 5.8s linear infinite" }}
      />

      <div
        className="absolute left-[-22%] top-[18%] h-36 w-[76%] -skew-x-12 bg-linear-to-r from-transparent via-cyan-300/16 to-transparent blur-xl"
        style={{ animation: "argusDataStream 7.2s ease-in-out infinite" }}
      />

      <div
        className="absolute right-[-24%] top-[56%] h-36 w-[78%] -skew-x-12 bg-linear-to-r from-transparent via-red-400/16 to-transparent blur-xl"
        style={{ animation: "argusDataStream 8.1s ease-in-out 1.2s infinite" }}
      />

      <div className="absolute left-5 top-5 h-12 w-12 border-l border-t border-cyan-300/40 argus-corner-blink" />
      <div className="absolute right-5 top-5 h-12 w-12 border-r border-t border-red-400/35 argus-corner-blink" />
      <div className="absolute bottom-5 left-5 h-12 w-12 border-b border-l border-cyan-300/35 argus-corner-blink" />
      <div className="absolute bottom-5 right-5 h-12 w-12 border-b border-r border-red-400/35 argus-corner-blink" />

      <div className="absolute left-10 top-1/2 h-px w-24 bg-linear-to-r from-transparent via-cyan-300/30 to-transparent" />
      <div className="absolute right-10 top-1/2 h-px w-24 bg-linear-to-r from-transparent via-red-400/28 to-transparent" />
      <div className="absolute left-1/2 top-10 h-20 w-px bg-linear-to-b from-transparent via-cyan-300/24 to-transparent" />
      <div className="absolute bottom-10 left-1/2 h-20 w-px bg-linear-to-b from-transparent via-red-400/22 to-transparent" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 720 560"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="earthCore" cx="42%" cy="34%" r="68%">
            <stop offset="0%" stopColor="#d8fbff" stopOpacity="0.62" />
            <stop offset="18%" stopColor="#67e8f9" stopOpacity="0.38" />
            <stop offset="38%" stopColor="#0ea5e9" stopOpacity="0.26" />
            <stop offset="64%" stopColor="#172554" stopOpacity="0.34" />
            <stop offset="82%" stopColor="#0a1120" stopOpacity="0.84" />
            <stop offset="100%" stopColor="#030712" stopOpacity="1" />
          </radialGradient>

          <radialGradient id="earthHighlight" cx="34%" cy="26%" r="46%">
            <stop offset="0%" stopColor="#d7f9ff" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#d7f9ff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#d7f9ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="earthAtmosphere" cx="50%" cy="50%" r="50%">
            <stop offset="58%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="78%" stopColor="#22d3ee" stopOpacity="0.20" />
            <stop offset="92%" stopColor="#60a5fa" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.46" />
          </radialGradient>

          <radialGradient id="darkSide" cx="68%" cy="58%" r="54%">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.34" />
            <stop offset="70%" stopColor="#020617" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="networkArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="24%" stopColor="#67e8f9" stopOpacity="1" />
            <stop offset="52%" stopColor="#38bdf8" stopOpacity="0.92" />
            <stop offset="76%" stopColor="#a78bfa" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="threatArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0" />
            <stop offset="28%" stopColor="#ef4444" stopOpacity="0.94" />
            <stop offset="58%" stopColor="#dc2626" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="landA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ddfbff" stopOpacity="0.34" />
            <stop offset="38%" stopColor="#38bdf8" stopOpacity="0.22" />
            <stop offset="72%" stopColor="#60a5fa" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.20" />
          </linearGradient>

          <linearGradient id="landB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.36" />
            <stop offset="52%" stopColor="#1d4ed8" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.18" />
          </linearGradient>

          <linearGradient id="scanFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0" />
            <stop offset="40%" stopColor="#67e8f9" stopOpacity="0.64" />
            <stop offset="72%" stopColor="#60a5fa" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="outerBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="30%" stopColor="#67e8f9" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="traceLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="40%" stopColor="#ef4444" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="satelliteBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.84" />
            <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="satelliteBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.98" />
            <stop offset="45%" stopColor="#7dd3fc" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.86" />
          </linearGradient>

          <linearGradient id="satellitePanel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#082f49" stopOpacity="0.96" />
            <stop offset="36%" stopColor="#0ea5e9" stopOpacity="0.92" />
            <stop offset="64%" stopColor="#38bdf8" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.96" />
          </linearGradient>

          <linearGradient id="satelliteAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="1" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.88" />
          </linearGradient>

          <linearGradient id="satelliteDishGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8fbff" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.56" />
          </linearGradient>

          <radialGradient id="satelliteCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="42%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="satelliteThrusterGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.92" />
            <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
          </linearGradient>

          <filter id="bigGlow">
            <feGaussianBlur stdDeviation="9" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="4.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="threatGlow">
            <feGaussianBlur stdDeviation="5.2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softBlur">
            <feGaussianBlur stdDeviation="16" />
          </filter>

          <filter id="shadowBlur">
            <feGaussianBlur stdDeviation="18" />
          </filter>

          <clipPath id="earthClip">
            <circle cx="360" cy="308" r="188" />
          </clipPath>

          <clipPath id="earthInnerClip">
            <circle cx="360" cy="308" r="178" />
          </clipPath>
        </defs>

        <g className="argus-bg-rotate" opacity="0.18">
          <circle
            cx="360"
            cy="308"
            r="286"
            fill="none"
            stroke="#67e8f9"
            strokeOpacity="0.18"
            strokeWidth="1"
            strokeDasharray="1 18"
          />
          <circle
            cx="360"
            cy="308"
            r="306"
            fill="none"
            stroke="#ef4444"
            strokeOpacity="0.14"
            strokeWidth="1"
            strokeDasharray="1 22"
          />
        </g>

        <g className="argus-bg-rotate-reverse" opacity="0.12">
          <circle
            cx="360"
            cy="308"
            r="258"
            fill="none"
            stroke="#a78bfa"
            strokeOpacity="0.18"
            strokeWidth="1"
            strokeDasharray="4 20"
          />
        </g>

        <g className="argus-glow">
          <circle
            cx="360"
            cy="308"
            r="252"
            fill="#0ea5e9"
            opacity="0.06"
            filter="url(#softBlur)"
          />
          <circle
            cx="360"
            cy="308"
            r="304"
            fill="#7f1d1d"
            opacity="0.07"
            filter="url(#softBlur)"
          />
        </g>

        <ellipse
          cx="360"
          cy="448"
          rx="188"
          ry="30"
          fill="#020617"
          opacity="0.52"
          filter="url(#shadowBlur)"
        />

        <g opacity="0.5">
          <circle
            cx="360"
            cy="308"
            r="224"
            fill="none"
            stroke="#22d3ee"
            strokeOpacity="0.08"
            strokeWidth="1"
            strokeDasharray="6 12"
          />
          <circle
            cx="360"
            cy="308"
            r="242"
            fill="none"
            stroke="#ef4444"
            strokeOpacity="0.08"
            strokeWidth="1"
            strokeDasharray="3 14"
          />
          <circle
            cx="360"
            cy="308"
            r="268"
            fill="none"
            stroke="#38bdf8"
            strokeOpacity="0.07"
            strokeWidth="1"
            strokeDasharray="10 18"
          />
        </g>

        {/* SATELLITE ORBIT + SATELLITE */}
        <g className="argus-satellite-orbit">
          <path
            d="M360 84 A224 224 0 1 1 359.99 84"
            fill="none"
            stroke="#67e8f9"
            strokeOpacity="0.12"
            strokeWidth="1.2"
            className="argus-satellite-trail"
          />
          <path
            d="M360 84 A224 224 0 1 1 359.99 84"
            fill="none"
            stroke="#ef4444"
            strokeOpacity="0.05"
            strokeWidth="0.8"
            strokeDasharray="2 14"
          />

          <g className="argus-satellite-self">
            {/* beam */}
            <g className="argus-satellite-beam">
              <path
                d="M360 90 L322 188 L398 188 Z"
                fill="url(#satelliteBeam)"
                opacity="0.22"
                className="argus-satellite-beam-sweep"
              />
              <path
                d="M360 90 L338 170"
                stroke="#67e8f9"
                strokeOpacity="0.46"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M360 90 L382 170"
                stroke="#67e8f9"
                strokeOpacity="0.32"
                strokeWidth="1.2"
                fill="none"
              />
            </g>

            {/* satellite pings */}
            <g filter="url(#bigGlow)">
              <circle
                className="argus-satellite-ping"
                cx="360"
                cy="84"
                r="9"
                fill="#67e8f9"
                opacity="0.28"
              />
              <circle
                className="argus-satellite-ping argus-satellite-ping-2"
                cx="360"
                cy="84"
                r="7"
                fill="#38bdf8"
                opacity="0.22"
              />
            </g>

            {/* support trail accent */}
            <path
              d="M360 68 C367 56 380 50 394 48"
              fill="none"
              stroke="#67e8f9"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <path
              d="M360 68 C352 56 340 50 326 48"
              fill="none"
              stroke="#ef4444"
              strokeOpacity="0.16"
              strokeWidth="1"
            />

            {/* satellite main body */}
            <g filter="url(#nodeGlow)">
              {/* rear frame */}
              <rect
                x="347"
                y="75"
                width="26"
                height="18"
                rx="5"
                fill="#0f172a"
                fillOpacity="0.86"
                stroke="#7dd3fc"
                strokeOpacity="0.28"
                strokeWidth="0.8"
              />

              {/* central body */}
              <rect
                x="350"
                y="76"
                width="20"
                height="16"
                rx="4"
                fill="url(#satelliteBody)"
                stroke="#dbeafe"
                strokeOpacity="0.62"
                strokeWidth="0.9"
              />

              {/* top cap */}
              <rect
                x="354"
                y="72"
                width="12"
                height="5"
                rx="2.5"
                fill="url(#satelliteAccent)"
                stroke="#dbeafe"
                strokeOpacity="0.56"
                strokeWidth="0.6"
              />

              {/* side arms */}
              <line
                x1="344"
                y1="84"
                x2="350"
                y2="84"
                stroke="#bae6fd"
                strokeOpacity="0.72"
                strokeWidth="1"
              />
              <line
                x1="370"
                y1="84"
                x2="376"
                y2="84"
                stroke="#bae6fd"
                strokeOpacity="0.72"
                strokeWidth="1"
              />

              {/* solar panel left */}
              <g className="argus-satellite-panel">
                <rect
                  x="320"
                  y="77"
                  width="22"
                  height="14"
                  rx="2.4"
                  fill="url(#satellitePanel)"
                  stroke="#7dd3fc"
                  strokeOpacity="0.42"
                  strokeWidth="0.8"
                />
                <path
                  d="M325 78.5 V90.5 M330 78.5 V90.5 M335 78.5 V90.5"
                  stroke="#d8fbff"
                  strokeOpacity="0.34"
                  strokeWidth="0.55"
                />
                <path
                  d="M321.5 82 H341.5 M321.5 86 H341.5"
                  stroke="#d8fbff"
                  strokeOpacity="0.24"
                  strokeWidth="0.5"
                />
              </g>

              {/* solar panel right */}
              <g className="argus-satellite-panel argus-satellite-panel-2">
                <rect
                  x="378"
                  y="77"
                  width="22"
                  height="14"
                  rx="2.4"
                  fill="url(#satellitePanel)"
                  stroke="#7dd3fc"
                  strokeOpacity="0.42"
                  strokeWidth="0.8"
                />
                <path
                  d="M383 78.5 V90.5 M388 78.5 V90.5 M393 78.5 V90.5"
                  stroke="#d8fbff"
                  strokeOpacity="0.34"
                  strokeWidth="0.55"
                />
                <path
                  d="M379.5 82 H399.5 M379.5 86 H399.5"
                  stroke="#d8fbff"
                  strokeOpacity="0.24"
                  strokeWidth="0.5"
                />
              </g>

              {/* small panel arms */}
              <line
                x1="342"
                y1="84"
                x2="347"
                y2="84"
                stroke="#dbeafe"
                strokeOpacity="0.68"
                strokeWidth="0.9"
              />
              <line
                x1="373"
                y1="84"
                x2="378"
                y2="84"
                stroke="#dbeafe"
                strokeOpacity="0.68"
                strokeWidth="0.9"
              />

              {/* scanner dish */}
              <g className="argus-satellite-dish">
                <line
                  x1="360"
                  y1="76"
                  x2="360"
                  y2="66"
                  stroke="#dbeafe"
                  strokeOpacity="0.7"
                  strokeWidth="1"
                />
                <path
                  d="M352 66 Q360 58 368 66 Q360 70 352 66 Z"
                  fill="url(#satelliteDishGlow)"
                  stroke="#d8fbff"
                  strokeOpacity="0.62"
                  strokeWidth="0.8"
                />
                <circle
                  cx="360"
                  cy="66"
                  r="1.5"
                  fill="#f8fafc"
                  opacity="0.92"
                />
              </g>

              {/* bottom sensor arm */}
              <line
                x1="360"
                y1="92"
                x2="360"
                y2="98"
                stroke="#dbeafe"
                strokeOpacity="0.58"
                strokeWidth="0.9"
              />
              <circle
                cx="360"
                cy="99.5"
                r="1.8"
                fill="#67e8f9"
                opacity="0.92"
              />

              {/* engine / thruster */}
              <rect
                x="355.8"
                y="92"
                width="8.4"
                height="3.6"
                rx="1.5"
                fill="#1e293b"
                stroke="#93c5fd"
                strokeOpacity="0.42"
                strokeWidth="0.55"
              />
              <path
                className="argus-satellite-thruster"
                d="M357.6 95.5 L362.4 95.5 L360 104 Z"
                fill="url(#satelliteThrusterGlow)"
                opacity="0.72"
              />

              {/* body details */}
              <circle
                cx="360"
                cy="84"
                r="3.2"
                fill="url(#satelliteCoreGlow)"
                className="argus-satellite-core"
              />
              <circle
                cx="360"
                cy="84"
                r="1.4"
                fill="#ffffff"
                opacity="0.96"
              />
              <circle
                cx="366.3"
                cy="80.8"
                r="1.4"
                fill="#ef4444"
                className="argus-satellite-light argus-satellite-light-2"
              />
              <circle
                cx="353.8"
                cy="87"
                r="1.35"
                fill="#22d3ee"
                className="argus-satellite-light"
              />
              <circle
                cx="365"
                cy="88.8"
                r="1.1"
                fill="#f59e0b"
                opacity="0.85"
              />
            </g>
          </g>
        </g>

        <g className="argus-globe-float">
          <g className="argus-globe-tilt">
            <g className="argus-orbit" opacity="0.55">
              <ellipse
                cx="360"
                cy="308"
                rx="266"
                ry="98"
                fill="none"
                stroke="#67e8f9"
                strokeOpacity="0.18"
                strokeWidth="1"
                strokeDasharray="10 12"
              />
              <circle
                className="argus-outer-node"
                cx="626"
                cy="308"
                r="3.2"
                fill="#67e8f9"
                opacity="0.95"
              />
            </g>

            <g className="argus-orbit-reverse" opacity="0.42">
              <ellipse
                cx="360"
                cy="308"
                rx="232"
                ry="82"
                fill="none"
                stroke="#ef4444"
                strokeOpacity="0.16"
                strokeWidth="1"
                strokeDasharray="7 14"
                transform="rotate(28 360 308)"
              />
              <circle
                className="argus-outer-node argus-outer-node-2"
                cx="572"
                cy="407"
                r="2.8"
                fill="#ef4444"
                opacity="0.86"
              />
            </g>

            <g className="argus-orbit-fast" opacity="0.32">
              <ellipse
                cx="360"
                cy="308"
                rx="214"
                ry="70"
                fill="none"
                stroke="#38bdf8"
                strokeOpacity="0.16"
                strokeWidth="1"
                strokeDasharray="4 12"
                transform="rotate(-34 360 308)"
              />
              <circle
                className="argus-outer-node argus-outer-node-3"
                cx="188"
                cy="184"
                r="2.6"
                fill="#38bdf8"
                opacity="0.76"
              />
            </g>

            {/* internal hud rings */}
            <g className="argus-reticle" opacity="0.28">
              <circle
                cx="360"
                cy="308"
                r="36"
                fill="none"
                stroke="#67e8f9"
                strokeOpacity="0.28"
                strokeWidth="1"
                strokeDasharray="6 8"
              />
              <circle
                cx="360"
                cy="308"
                r="56"
                fill="none"
                stroke="#ef4444"
                strokeOpacity="0.14"
                strokeWidth="1"
                strokeDasharray="4 12"
              />
              <path
                d="M360 244 V262 M360 354 V372 M296 308 H314 M406 308 H424"
                stroke="#dbeafe"
                strokeOpacity="0.22"
                strokeWidth="1"
              />
            </g>

            <g opacity="0.38">
              <path d="M360 62 V88" stroke="#67e8f9" strokeWidth="1.2" />
              <path d="M360 528 V554" stroke="#ef4444" strokeWidth="1.2" />
              <path d="M114 308 H140" stroke="#67e8f9" strokeWidth="1.2" />
              <path d="M580 308 H606" stroke="#ef4444" strokeWidth="1.2" />
            </g>

            <g opacity="0.42">
              <path
                d="M162 190 A240 240 0 0 1 220 136"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1"
                className="argus-danger-arc"
              />
              <path
                d="M500 466 A240 240 0 0 1 560 412"
                fill="none"
                stroke="#67e8f9"
                strokeWidth="1"
                className="argus-danger-arc"
              />
              <path
                d="M172 430 A240 240 0 0 1 126 344"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1"
                className="argus-danger-arc"
              />
              <path
                d="M548 160 A240 240 0 0 1 612 244"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1"
                className="argus-danger-arc"
              />
            </g>

            <circle
              cx="360"
              cy="308"
              r="188"
              fill="url(#earthCore)"
              stroke="#7dd3fc"
              strokeOpacity="0.28"
              strokeWidth="1.5"
              filter="url(#bigGlow)"
            />

            <circle
              cx="360"
              cy="308"
              r="193"
              fill="url(#earthAtmosphere)"
              opacity="0.88"
            />

            <circle
              cx="360"
              cy="308"
              r="182"
              fill="url(#earthHighlight)"
              opacity="0.72"
            />

            <circle
              cx="360"
              cy="308"
              r="186"
              fill="url(#darkSide)"
              opacity="0.62"
            />

            <g clipPath="url(#earthInnerClip)">
              <rect
                x="172"
                y="120"
                width="376"
                height="376"
                fill="rgba(2,6,23,0.10)"
              />

              <g opacity="0.62">
                <ellipse
                  cx="360"
                  cy="308"
                  rx="188"
                  ry="24"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
                <ellipse
                  cx="360"
                  cy="308"
                  rx="188"
                  ry="58"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeOpacity="0.14"
                  strokeWidth="1"
                />
                <ellipse
                  cx="360"
                  cy="308"
                  rx="188"
                  ry="96"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeOpacity="0.11"
                  strokeWidth="1"
                />
                <ellipse
                  cx="360"
                  cy="308"
                  rx="188"
                  ry="138"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                />
                <ellipse
                  cx="360"
                  cy="308"
                  rx="42"
                  ry="188"
                  fill="none"
                  stroke="#67e8f9"
                  strokeOpacity="0.11"
                  strokeWidth="1"
                />
                <ellipse
                  cx="360"
                  cy="308"
                  rx="86"
                  ry="188"
                  fill="none"
                  stroke="#67e8f9"
                  strokeOpacity="0.10"
                  strokeWidth="1"
                />
                <ellipse
                  cx="360"
                  cy="308"
                  rx="130"
                  ry="188"
                  fill="none"
                  stroke="#67e8f9"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                />
              </g>

              {/* extra rotating rings inside globe */}
              <g className="argus-mini-spin" opacity="0.18">
                <ellipse
                  cx="360"
                  cy="308"
                  rx="148"
                  ry="112"
                  fill="none"
                  stroke="#67e8f9"
                  strokeOpacity="0.22"
                  strokeWidth="0.9"
                  strokeDasharray="2 10"
                />
              </g>

              <g className="argus-mini-spin-reverse" opacity="0.14">
                <ellipse
                  cx="360"
                  cy="308"
                  rx="118"
                  ry="146"
                  fill="none"
                  stroke="#ef4444"
                  strokeOpacity="0.18"
                  strokeWidth="0.9"
                  strokeDasharray="3 12"
                />
              </g>

              <g opacity="0.18">
                <path
                  d="M172 238 C250 210 300 220 360 206 C422 192 480 204 548 184"
                  fill="none"
                  stroke="#a5f3fc"
                  strokeWidth="0.8"
                />
                <path
                  d="M172 284 C250 258 306 274 360 252 C424 226 492 242 548 236"
                  fill="none"
                  stroke="#a5f3fc"
                  strokeWidth="0.8"
                />
                <path
                  d="M172 362 C240 330 312 352 360 334 C420 312 484 336 548 318"
                  fill="none"
                  stroke="#a5f3fc"
                  strokeWidth="0.8"
                />
                <path
                  d="M172 412 C246 396 306 414 360 398 C432 376 492 390 548 382"
                  fill="none"
                  stroke="#a5f3fc"
                  strokeWidth="0.8"
                />
              </g>

              <g className="argus-map-drift">
                <g>
                  <path
                    d="M216 224 C238 192 286 182 326 198 C354 210 376 230 364 254 C354 278 316 268 302 292 C286 318 322 334 300 362 C276 388 234 358 220 328 C206 296 194 254 216 224 Z"
                    fill="url(#landA)"
                    stroke="#a5f3fc"
                    strokeOpacity="0.24"
                    strokeWidth="1"
                  />
                  <path
                    d="M382 178 C438 166 498 188 526 226 C554 262 534 300 490 294 C456 290 448 268 418 276 C384 286 348 268 352 236 C356 204 356 186 382 178 Z"
                    fill="url(#landA)"
                    stroke="#a5f3fc"
                    strokeOpacity="0.20"
                    strokeWidth="1"
                  />
                  <path
                    d="M392 316 C430 300 474 316 498 346 C522 378 508 424 470 448 C432 472 390 452 370 420 C350 388 354 332 392 316 Z"
                    fill="url(#landB)"
                    stroke="#93c5fd"
                    strokeOpacity="0.18"
                    strokeWidth="1"
                  />
                  <path
                    d="M288 406 C316 390 352 396 368 416 C386 438 370 468 338 476 C308 484 280 460 274 434 C270 420 276 410 288 406 Z"
                    fill="url(#landA)"
                    stroke="#a5f3fc"
                    strokeOpacity="0.16"
                    strokeWidth="1"
                  />
                  <path
                    d="M520 326 C550 316 584 330 600 354 C616 378 598 406 568 402 C542 398 526 374 510 356 C498 342 504 330 520 326 Z"
                    fill="url(#landA)"
                    stroke="#c4b5fd"
                    strokeOpacity="0.14"
                    strokeWidth="1"
                  />
                  <path
                    d="M144 266 C178 244 212 252 230 278 C248 304 226 338 190 340 C154 342 128 312 126 288 C124 276 132 270 144 266 Z"
                    fill="url(#landB)"
                    stroke="#60a5fa"
                    strokeOpacity="0.16"
                    strokeWidth="1"
                  />
                </g>

                <g transform="translate(330 0)">
                  <path
                    d="M216 224 C238 192 286 182 326 198 C354 210 376 230 364 254 C354 278 316 268 302 292 C286 318 322 334 300 362 C276 388 234 358 220 328 C206 296 194 254 216 224 Z"
                    fill="url(#landA)"
                    stroke="#a5f3fc"
                    strokeOpacity="0.24"
                    strokeWidth="1"
                  />
                  <path
                    d="M382 178 C438 166 498 188 526 226 C554 262 534 300 490 294 C456 290 448 268 418 276 C384 286 348 268 352 236 C356 204 356 186 382 178 Z"
                    fill="url(#landA)"
                    stroke="#a5f3fc"
                    strokeOpacity="0.20"
                    strokeWidth="1"
                  />
                  <path
                    d="M392 316 C430 300 474 316 498 346 C522 378 508 424 470 448 C432 472 390 452 370 420 C350 388 354 332 392 316 Z"
                    fill="url(#landB)"
                    stroke="#93c5fd"
                    strokeOpacity="0.18"
                    strokeWidth="1"
                  />
                </g>

                <g transform="translate(-330 0)">
                  <path
                    d="M216 224 C238 192 286 182 326 198 C354 210 376 230 364 254 C354 278 316 268 302 292 C286 318 322 334 300 362 C276 388 234 358 220 328 C206 296 194 254 216 224 Z"
                    fill="url(#landA)"
                    stroke="#a5f3fc"
                    strokeOpacity="0.24"
                    strokeWidth="1"
                  />
                  <path
                    d="M382 178 C438 166 498 188 526 226 C554 262 534 300 490 294 C456 290 448 268 418 276 C384 286 348 268 352 236 C356 204 356 186 382 178 Z"
                    fill="url(#landA)"
                    stroke="#a5f3fc"
                    strokeOpacity="0.20"
                    strokeWidth="1"
                  />
                </g>
              </g>

              <g opacity="0.95" filter="url(#bigGlow)">
                <path
                  d="M206 326 C268 216 388 214 466 294"
                  fill="none"
                  stroke="url(#networkArc)"
                  strokeWidth="2.1"
                  className="argus-arc"
                />
                <path
                  d="M244 382 C316 250 462 242 560 328"
                  fill="none"
                  stroke="url(#networkArc)"
                  strokeWidth="2.1"
                  className="argus-arc argus-arc-2"
                />
                <path
                  d="M176 368 C276 274 420 304 560 238"
                  fill="none"
                  stroke="url(#threatArc)"
                  strokeWidth="1.8"
                  className="argus-arc argus-arc-3"
                />
                <path
                  d="M284 242 C336 372 438 418 596 376"
                  fill="none"
                  stroke="url(#networkArc)"
                  strokeWidth="1.7"
                  className="argus-arc argus-arc-4"
                />
                <path
                  d="M158 310 C270 450 430 456 588 332"
                  fill="none"
                  stroke="url(#threatArc)"
                  strokeWidth="1.7"
                  className="argus-arc argus-arc-5"
                />
                <path
                  d="M226 260 C330 184 470 188 580 278"
                  fill="none"
                  stroke="url(#networkArc)"
                  strokeWidth="1.55"
                  className="argus-arc argus-arc-6"
                />
              </g>

              <g clipPath="url(#earthInnerClip)" filter="url(#threatGlow)">
                {threats.map((point) => {
                  const style = {
                    ["--tx" as any]: `${point.driftX}px`,
                    ["--ty" as any]: `${point.driftY}px`,
                    ["--dur" as any]: `${point.duration}s`,
                    ["--delay" as any]: `${point.delay}s`,
                    ["--life" as any]: `${point.life}s`,
                    ["--threat-opacity" as any]: point.opacity,
                  } as React.CSSProperties;

                  return (
                    <g
                      key={point.id}
                      className="argus-threat-group"
                      style={style}
                    >
                      <path
                        className="argus-threat-trace"
                        d={`M${point.x} ${point.y} C${(point.x + CENTER_X) / 2} ${
                          point.y - 26
                        } ${(point.x + CENTER_X) / 2} ${CENTER_Y + 24} ${CENTER_X} ${CENTER_Y}`}
                        fill="none"
                        stroke="url(#traceLine)"
                        strokeWidth="1.1"
                        opacity="0.6"
                      />

                      <circle
                        className="argus-threat-ping"
                        cx={point.x}
                        cy={point.y}
                        r={point.size * point.halo}
                        fill="#ef4444"
                        opacity="0.30"
                      />
                      <circle
                        className="argus-threat-ping argus-threat-ping-2"
                        cx={point.x}
                        cy={point.y}
                        r={point.size * 1.35}
                        fill="#b91c1c"
                        opacity="0.22"
                      />
                      <circle
                        className="argus-threat-core"
                        cx={point.x}
                        cy={point.y}
                        r={point.size}
                        fill="#ef4444"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={point.size * 0.42}
                        fill="#fee2e2"
                        opacity="0.72"
                      />
                    </g>
                  );
                })}
              </g>

              <g filter="url(#bigGlow)" opacity="0.94">
                <circle
                  className="argus-scan-ring"
                  cx="360"
                  cy="308"
                  r="64"
                  fill="none"
                  stroke="#67e8f9"
                  strokeOpacity="0.78"
                  strokeWidth="1.2"
                />
                <circle
                  className="argus-scan-ring argus-scan-ring-2"
                  cx="360"
                  cy="308"
                  r="94"
                  fill="none"
                  stroke="#38bdf8"
                  strokeOpacity="0.60"
                  strokeWidth="1.1"
                />
                <circle
                  className="argus-scan-ring argus-scan-ring-3"
                  cx="360"
                  cy="308"
                  r="124"
                  fill="none"
                  stroke="#60a5fa"
                  strokeOpacity="0.44"
                  strokeWidth="1.05"
                />
                <circle
                  className="argus-scan-ring argus-scan-ring-4"
                  cx="360"
                  cy="308"
                  r="152"
                  fill="none"
                  stroke="#ef4444"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                />
              </g>

              <g className="argus-radar" clipPath="url(#earthClip)">
                <path
                  d="M360 308 L360 120 A188 188 0 0 1 520 210 Z"
                  fill="url(#scanFill)"
                  opacity="0.28"
                />
                <line
                  x1="360"
                  y1="308"
                  x2="360"
                  y2="120"
                  stroke="#67e8f9"
                  strokeOpacity="0.58"
                  strokeWidth="1"
                />
              </g>

              <g filter="url(#nodeGlow)">
                {microNodes.map((node, index) => (
                  <circle
                    key={index}
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={node.c}
                    opacity={node.opacity}
                  />
                ))}
              </g>

              <g opacity="0.18">
                <path
                  d="M256 256 L282 256 L282 282"
                  stroke="#67e8f9"
                  strokeWidth="0.8"
                  fill="none"
                />
                <path
                  d="M468 246 L438 246 L438 276"
                  stroke="#ef4444"
                  strokeWidth="0.8"
                  fill="none"
                />
                <path
                  d="M288 396 L320 396 L320 366"
                  stroke="#67e8f9"
                  strokeWidth="0.8"
                  fill="none"
                />
                <path
                  d="M488 374 L460 374 L460 348"
                  stroke="#ef4444"
                  strokeWidth="0.8"
                  fill="none"
                />
              </g>

              {/* globe internal scan bars */}
              <g opacity="0.16">
                <rect
                  x="182"
                  y="188"
                  width="356"
                  height="5"
                  rx="2.5"
                  fill="url(#outerBeam)"
                  className="argus-hud-sweep"
                />
                <rect
                  x="198"
                  y="424"
                  width="328"
                  height="3"
                  rx="1.5"
                  fill="url(#outerBeam)"
                  className="argus-hud-sweep"
                  style={{ animationDelay: "1.6s" }}
                />
              </g>
            </g>

            <circle
              cx="360"
              cy="308"
              r="188"
              fill="none"
              stroke="#e0f2fe"
              strokeOpacity="0.20"
              strokeWidth="1.15"
            />
            <circle
              cx="360"
              cy="308"
              r="178"
              fill="none"
              stroke="#67e8f9"
              strokeOpacity="0.11"
              strokeWidth="1"
            />
            <circle
              className="argus-ring-blink"
              cx="360"
              cy="308"
              r="198"
              fill="none"
              stroke="#ef4444"
              strokeOpacity="0.10"
              strokeWidth="1"
              strokeDasharray="2 12"
            />
          </g>
        </g>

        <g filter="url(#nodeGlow)">
          {outerParticles.map((particle, index) => (
            <circle
              key={index}
              className={particle.cls}
              cx={particle.x}
              cy={particle.y}
              r={particle.r}
              fill={particle.c}
              opacity={particle.o}
            />
          ))}
        </g>

        <g opacity="0.55">
          {circuitLines.map((line, index) => (
            <path
              key={index}
              d={line.d}
              stroke={line.stroke}
              strokeOpacity={line.opacity}
              strokeWidth={line.width}
              strokeDasharray="24 12"
              className={line.cls}
              fill="none"
            />
          ))}
        </g>

        {/* outer decorations */}
        <g opacity="0.5">
          <path
            d="M54 132 H106"
            stroke="#67e8f9"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
          <path
            d="M614 434 H676"
            stroke="#ef4444"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
          <path
            d="M602 166 H668"
            stroke="#38bdf8"
            strokeOpacity="0.16"
            strokeWidth="1"
          />
          <path
            d="M58 410 H126"
            stroke="#ef4444"
            strokeOpacity="0.16"
            strokeWidth="1"
          />
          <path
            d="M92 90 H170"
            stroke="url(#outerBeam)"
            strokeWidth="1.2"
            opacity="0.48"
          />
          <path
            d="M544 470 H642"
            stroke="url(#outerBeam)"
            strokeWidth="1.2"
            opacity="0.42"
          />
          <path
            d="M204 72 H258 V96"
            stroke="#67e8f9"
            strokeOpacity="0.16"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M516 76 H464 V104"
            stroke="#ef4444"
            strokeOpacity="0.14"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M210 510 H270 V488"
            stroke="#38bdf8"
            strokeOpacity="0.14"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M510 508 H454 V480"
            stroke="#ef4444"
            strokeOpacity="0.14"
            strokeWidth="1"
            fill="none"
          />
        </g>

        <g opacity="0.28">
          <circle
            cx="90"
            cy="132"
            r="10"
            fill="none"
            stroke="#67e8f9"
            strokeOpacity="0.2"
          />
          <circle
            cx="630"
            cy="432"
            r="10"
            fill="none"
            stroke="#ef4444"
            strokeOpacity="0.18"
          />
          <circle
            cx="622"
            cy="168"
            r="7"
            fill="none"
            stroke="#38bdf8"
            strokeOpacity="0.16"
          />
          <circle
            cx="96"
            cy="410"
            r="7"
            fill="none"
            stroke="#ef4444"
            strokeOpacity="0.16"
          />
          <circle
            cx="176"
            cy="86"
            r="6"
            fill="none"
            stroke="#67e8f9"
            strokeOpacity="0.16"
          />
          <circle
            cx="540"
            cy="500"
            r="8"
            fill="none"
            stroke="#ef4444"
            strokeOpacity="0.14"
          />
        </g>
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,transparent_0%,rgba(2,6,23,0.06)_38%,rgba(2,6,23,0.52)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-slate-950/42 via-slate-950/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-28 bg-linear-to-r from-slate-950/42 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-28 bg-linear-to-l from-slate-950/42 to-transparent" />
    </div>
  );
};

export default NetworkGlobeAnimation;