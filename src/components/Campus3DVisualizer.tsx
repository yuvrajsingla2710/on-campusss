import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface Campus3DVisualizerProps {
  onSelectNode?: (hubName: string) => void;
}

type HubDef = {
  name: string;
  category: string;
  metric: string;
  color: number;
  angle: number;
  radius: number;
  shape: 'tower' | 'lab' | 'dome' | 'slab' | 'atrium' | 'core';
  blurb: string;
  facts: string[];
};

const HUBS: HubDef[] = [
  { name: 'COMPASS AI', category: 'CO-PILOT', metric: 'Campus Brain', color: 0xf472b6, angle: 0, radius: 0, shape: 'core',
    blurb: 'The central intelligence tying every district together — ask anything about campus life.',
    facts: ['Answers in seconds', 'Knows all 6 hubs', 'Available 24/7'] },
  { name: 'BORROW LAB', category: 'HARDWARE', metric: '42+ Available', color: 0x00f2ff, angle: -Math.PI / 2, radius: 26, shape: 'lab',
    blurb: 'Borrow gear from peers instead of buying it — cameras, kits, boards and tools.',
    facts: ['42+ items live', 'Zero deposits', 'Peer-verified'] },
  { name: 'MENTORSHIP', category: 'SENIORS', metric: '98% Verified', color: 0xa855f7, angle: -Math.PI / 2 + (Math.PI * 2) / 5, radius: 26, shape: 'tower',
    blurb: 'Seniors and alumni who have walked your path, one message away.',
    facts: ['98% verified profiles', 'Avg reply < 6h', 'Placement & research tracks'] },
  { name: 'SKILL MATRIX', category: 'EXCHANGE', metric: '600+ Skills', color: 0xf472b6, angle: -Math.PI / 2 + (Math.PI * 4) / 5, radius: 26, shape: 'atrium',
    blurb: 'Trade what you know for what you want to learn, no money involved.',
    facts: ['600+ skills mapped', 'Match by timetable', 'Barter-based'] },
  { name: 'CAMPUS PULSE', category: 'COMMUNITY', metric: 'Live 24/7', color: 0x34d399, angle: -Math.PI / 2 + (Math.PI * 6) / 5, radius: 26, shape: 'dome',
    blurb: 'The live feed of everything happening right now across hostels and blocks.',
    facts: ['Real-time posts', 'Event radar', 'Wing-level channels'] },
  { name: 'MARKETPLACE', category: 'STUDENT TRADE', metric: '₹0 Commission', color: 0xfbbf24, angle: -Math.PI / 2 + (Math.PI * 8) / 5, radius: 26, shape: 'slab',
    blurb: 'Buy and sell within campus with zero commission and verified students only.',
    facts: ['₹0 commission', 'Campus-only buyers', 'Instant chat'] },
];

const hexOf = (c: number) => `#${c.toString(16).padStart(6, '0')}`;

let MAX_ANISO = 4;

function tuneTexture(tex: THREE.Texture) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = MAX_ANISO;
  tex.needsUpdate = true;
}


/* ------------------------------------------------------------------ */
/* Textures                                                            */
/* ------------------------------------------------------------------ */

function makeWindowTexture(color: number, seed: number): THREE.CanvasTexture {
  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, '#0b1020');
  base.addColorStop(1, '#05070e');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const cols = 10;
  const rows = 16;
  const cw = w / cols;
  const ch = h / rows;
  let s = seed * 9301;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const c = new THREE.Color(color);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const r = rnd();
      if (r < 0.42) continue;
      const lit = r > 0.82;
      const alpha = lit ? 0.95 : 0.28 + r * 0.25;
      ctx.fillStyle = lit
        ? `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${alpha})`
        : `rgba(150, 190, 230, ${alpha * 0.5})`;
      ctx.fillRect(x * cw + cw * 0.22, y * ch + ch * 0.24, cw * 0.56, ch * 0.44);
    }
  }

  // horizontal floor bands
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let y = 0; y < rows; y++) ctx.fillRect(0, y * ch + ch * 0.86, w, 1.5);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function makeLabelTexture(hub: HubDef): THREE.CanvasTexture {
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const accent = hexOf(hub.color);

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.roundRect(16, 44, w - 32, 150, 26);
  ctx.fillStyle = 'rgba(6, 10, 20, 0.82)';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(40, 66, 14, 106, 7);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.fillText(hub.category, 74, 96);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 40px "Outfit", sans-serif';
  ctx.fillText(hub.name, 74, 142);

  ctx.fillStyle = 'rgba(255,255,255,0.62)';
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.fillText(hub.metric, 74, 176);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Campus3DVisualizer({ onSelectNode }: Campus3DVisualizerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HubDef | null>(null);
  const [, setFocused] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const selectRef = useRef(onSelectNode);
  selectRef.current = onSelectNode;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    /* ---------------- renderer / scene / camera ---------------- */
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' });
    let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    renderer.setClearColor(0x05070f, 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'pan-y';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070f, 0.0095);

    const camera = new THREE.PerspectiveCamera(46, mount.clientWidth / mount.clientHeight, 0.5, 400);
    camera.position.set(0, 36, 88);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.7;
    controls.enablePan = false;
    controls.minDistance = 48;
    controls.maxDistance = 170;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 2.25;
    controls.autoRotate = !prefersReduced;
    controls.autoRotateSpeed = 0.35;
    controls.target.set(0, 4, 0);

    /* ---------------- lighting ---------------- */
    scene.add(new THREE.HemisphereLight(0x6ea8ff, 0x050810, 0.55));
    const key = new THREE.DirectionalLight(0xbcd6ff, 1.1);
    key.position.set(28, 44, 20);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff7ac6, 0.4);
    rim.position.set(-30, 18, -26);
    scene.add(rim);

    const glowTex = makeGlowTexture();
    const disposables: { dispose: () => void }[] = [glowTex];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    /* ---------------- ground ---------------- */
    const groundGeo = track(new THREE.CircleGeometry(60, 96));
    const groundMat = track(
      new THREE.MeshStandardMaterial({ color: 0x0a1020, roughness: 0.55, metalness: 0.35 })
    );
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const grid = new THREE.GridHelper(120, 60, 0x1e3a5f, 0x101c30);
    (grid.material as THREE.Material).opacity = 0.35;
    (grid.material as THREE.Material).transparent = true;
    grid.position.y = 0.02;
    scene.add(grid);

    // ring road
    const ringGeo = track(new THREE.RingGeometry(24.4, 27.6, 128));
    const ringMat = track(new THREE.MeshBasicMaterial({ color: 0x0e2a3d, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    scene.add(ring);

    const ringEdgeGeo = track(new THREE.TorusGeometry(26, 0.08, 8, 160));
    const ringEdgeMat = track(new THREE.MeshBasicMaterial({ color: 0x2ee6ff, transparent: true, opacity: 0.35 }));
    const ringEdge = new THREE.Mesh(ringEdgeGeo, ringEdgeMat);
    ringEdge.rotation.x = -Math.PI / 2;
    ringEdge.position.y = 0.12;
    scene.add(ringEdge);

    // central plaza
    const plazaGeo = track(new THREE.CircleGeometry(9, 64));
    const plazaMat = track(new THREE.MeshStandardMaterial({ color: 0x0b1424, metalness: 0.7, roughness: 0.25 }));
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.08;
    scene.add(plaza);

    /* ---------------- district buildings ---------------- */
    const hubGroups: { group: THREE.Group; hub: HubDef; baseY: number; halo: THREE.Sprite; label: THREE.Sprite }[] = [];
    const pickTargets: THREE.Object3D[] = [];

    const buildBody = (hub: HubDef, index: number): THREE.Group => {
      const g = new THREE.Group();
      const winTex = track(makeWindowTexture(hub.color, index + 3));
      const bodyMat = track(
        new THREE.MeshStandardMaterial({
          color: 0x0d1424,
          roughness: 0.35,
          metalness: 0.7,
          map: winTex,
          emissive: new THREE.Color(hub.color).multiplyScalar(0.85),
          emissiveIntensity: 1.5,
          emissiveMap: winTex,
        })
      );
      const trimMat = track(
        new THREE.MeshBasicMaterial({ color: hub.color, transparent: true, opacity: 0.9 })
      );

      const addBlock = (w: number, h: number, d: number, x: number, y: number, z: number, rotY = 0) => {
        const geo = track(new THREE.BoxGeometry(w, h, d));
        const m = new THREE.Mesh(geo, bodyMat);
        m.position.set(x, y + h / 2, z);
        m.rotation.y = rotY;
        g.add(m);
        // glowing roof trim
        const trimGeo = track(new THREE.BoxGeometry(w * 1.02, 0.16, d * 1.02));
        const trim = new THREE.Mesh(trimGeo, trimMat);
        trim.position.set(x, y + h + 0.08, z);
        trim.rotation.y = rotY;
        g.add(trim);
        return m;
      };

      switch (hub.shape) {
        case 'core': {
          addBlock(7, 20, 7, 0, 0, 0, Math.PI / 4);
          addBlock(10, 7, 10, 0, 0, 0);
          const spireGeo = track(new THREE.ConeGeometry(2.6, 9, 5));
          const spire = new THREE.Mesh(spireGeo, trimMat);
          spire.position.y = 24;
          g.add(spire);
          break;
        }
        case 'tower':
          addBlock(6, 22, 6, 0, 0, 0);
          addBlock(9, 8, 9, 0, 0, 0);
          addBlock(3.4, 5, 3.4, 0, 22, 0, Math.PI / 4);
          break;
        case 'lab':
          addBlock(13, 7, 9, 0, 0, 0);
          addBlock(6, 13, 6, -3.4, 7, 0);
          addBlock(5, 4, 12, 4.5, 0, 0);
          break;
        case 'dome': {
          addBlock(12, 5, 12, 0, 0, 0);
          const domeGeo = track(new THREE.SphereGeometry(6, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2));
          const domeMat = track(
            new THREE.MeshPhysicalMaterial({
              color: 0x0c1b26,
              roughness: 0.12,
              metalness: 0.2,
              transmission: 0.6,
              thickness: 1.4,
              transparent: true,
              opacity: 0.9,
              emissive: new THREE.Color(hub.color).multiplyScalar(0.55),
            })
          );
          const dome = new THREE.Mesh(domeGeo, domeMat);
          dome.position.y = 5;
          g.add(dome);
          const wireGeo = track(new THREE.SphereGeometry(6.05, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2));
          const wire = new THREE.Mesh(
            wireGeo,
            track(new THREE.MeshBasicMaterial({ color: hub.color, wireframe: true, transparent: true, opacity: 0.28 }))
          );
          wire.position.y = 5;
          g.add(wire);
          break;
        }
        case 'slab':
          addBlock(16, 9, 7, 0, 0, 0);
          addBlock(7, 16, 7, 5, 9, 0);
          addBlock(5, 3, 5, -5.5, 9, 0);
          break;
        case 'atrium': {
          addBlock(8, 15, 8, -4, 0, 0);
          addBlock(8, 11, 8, 4.5, 0, 1.5);
          const bridgeGeo = track(new THREE.BoxGeometry(9, 1.6, 3));
          const bridge = new THREE.Mesh(
            bridgeGeo,
            track(new THREE.MeshStandardMaterial({ color: 0x101a2c, emissive: new THREE.Color(hub.color).multiplyScalar(0.75), metalness: 0.6, roughness: 0.3 }))
          );
          bridge.position.set(0.3, 9.5, 0.8);
          g.add(bridge);
          break;
        }
      }

      // base podium ring
      const padGeo = track(new THREE.CylinderGeometry(11, 11, 0.5, 48));
      const pad = new THREE.Mesh(
        padGeo,
        track(new THREE.MeshStandardMaterial({ color: 0x0a1120, metalness: 0.6, roughness: 0.4 }))
      );
      pad.position.y = 0.25;
      g.add(pad);

      const padRimGeo = track(new THREE.TorusGeometry(11, 0.12, 8, 64));
      const padRim = new THREE.Mesh(padRimGeo, trimMat);
      padRim.rotation.x = -Math.PI / 2;
      padRim.position.y = 0.55;
      g.add(padRim);

      return g;
    };

    HUBS.forEach((hub, i) => {
      const group = buildBody(hub, i);
      const x = Math.cos(hub.angle) * hub.radius;
      const z = Math.sin(hub.angle) * hub.radius;
      group.position.set(x, 0, z);
      group.lookAt(0, 0, 0);
      group.userData['hubName'] = hub.name;
      group.traverse((o) => {
        o.userData['hubName'] = hub.name;
        if ((o as THREE.Mesh).isMesh) pickTargets.push(o);
      });

      // ground halo
      const halo = new THREE.Sprite(
        track(new THREE.SpriteMaterial({ map: glowTex, color: hub.color, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }))
      );
      halo.scale.set(30, 30, 1);
      halo.position.set(x, 1.5, z);
      scene.add(halo);

      // holographic label
      const labelTex = track(makeLabelTexture(hub));
      const label = new THREE.Sprite(
        track(new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false, depthWrite: false }))
      );
      const labelH = hub.shape === 'core' ? 34 : 28;
      label.scale.set(16, 8, 1);
      label.position.set(x, labelH, z);
      label.renderOrder = 10;
      scene.add(label);

      scene.add(group);
      hubGroups.push({ group, hub, baseY: 0, halo, label });
    });

    /* ---------------- data links between hubs ---------------- */
    const linkGroup = new THREE.Group();
    const linkCurves: { curve: THREE.QuadraticBezierCurve3; color: number }[] = [];
    for (let i = 1; i < HUBS.length; i++) {
      const a = HUBS[i]!;
      const b = HUBS[(i % (HUBS.length - 1)) + 1]!;
      const pa = new THREE.Vector3(Math.cos(a.angle) * a.radius, 8, Math.sin(a.angle) * a.radius);
      const pb = new THREE.Vector3(Math.cos(b.angle) * b.radius, 8, Math.sin(b.angle) * b.radius);
      const mid = pa.clone().add(pb).multiplyScalar(0.5);
      mid.y += 14;
      linkCurves.push({ curve: new THREE.QuadraticBezierCurve3(pa, mid, pb), color: a.color });
      // hub -> core
      const core = new THREE.Vector3(0, 12, 0);
      const midC = pa.clone().add(core).multiplyScalar(0.5);
      midC.y += 10;
      linkCurves.push({ curve: new THREE.QuadraticBezierCurve3(pa, midC, core), color: a.color });
    }
    linkCurves.forEach(({ curve, color }) => {
      const geo = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)));
      const mat = track(new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.22 }));
      linkGroup.add(new THREE.Line(geo, mat));
    });
    scene.add(linkGroup);

    // packets travelling the links
    const packetCount = isMobile ? 26 : 48;
    const packetGeo = track(new THREE.SphereGeometry(0.28, 8, 8));
    const packets: { mesh: THREE.Mesh; curveIdx: number; t: number; speed: number }[] = [];
    for (let i = 0; i < packetCount; i++) {
      const idx = i % linkCurves.length;
      const mat = track(new THREE.MeshBasicMaterial({ color: linkCurves[idx]!.color }));
      const mesh = new THREE.Mesh(packetGeo, mat);
      scene.add(mesh);
      packets.push({ mesh, curveIdx: idx, t: Math.random(), speed: 0.06 + Math.random() * 0.1 });
    }

    /* ---------------- trees + street lamps (instanced) ---------------- */
    const treeCount = isMobile ? 120 : 260;
    const treeGeo = track(new THREE.ConeGeometry(0.8, 2.6, 6));
    const treeMat = track(new THREE.MeshStandardMaterial({ color: 0x123a2c, roughness: 0.9, metalness: 0.05, emissive: 0x04140f }));
    const trees = new THREE.InstancedMesh(treeGeo, treeMat, treeCount);
    const dummy = new THREE.Object3D();
    let placed = 0;
    let guard = 0;
    while (placed < treeCount && guard < treeCount * 12) {
      guard++;
      const r = 10 + Math.random() * 46;
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (r > 24 && r < 28) continue; // keep road clear
      const nearHub = HUBS.some((h) => {
        const hx = Math.cos(h.angle) * h.radius;
        const hz = Math.sin(h.angle) * h.radius;
        return Math.hypot(x - hx, z - hz) < 13;
      });
      if (nearHub) continue;
      const s = 0.7 + Math.random() * 0.9;
      dummy.position.set(x, 1.3 * s, z);
      dummy.scale.setScalar(s);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      trees.setMatrixAt(placed, dummy.matrix);
      placed++;
    }
    trees.count = placed;
    trees.instanceMatrix.needsUpdate = true;
    scene.add(trees);

    /* ---------------- shuttles on the ring road ---------------- */
    const shuttleCount = isMobile ? 6 : 12;
    const shuttleGeo = track(new THREE.BoxGeometry(1.6, 0.5, 0.7));
    const shuttleMat = track(new THREE.MeshBasicMaterial({ color: 0x8ef4ff }));
    const shuttles: { mesh: THREE.Mesh; a: number; speed: number; r: number }[] = [];
    for (let i = 0; i < shuttleCount; i++) {
      const mesh = new THREE.Mesh(shuttleGeo, shuttleMat);
      scene.add(mesh);
      shuttles.push({
        mesh,
        a: (i / shuttleCount) * Math.PI * 2,
        speed: (i % 2 === 0 ? 1 : -1) * (0.09 + Math.random() * 0.05),
        r: i % 2 === 0 ? 25.2 : 26.8,
      });
    }

    /* ---------------- students: glowing points on spokes ---------------- */
    const walkerCount = isMobile ? 90 : 200;
    const walkerPos = new Float32Array(walkerCount * 3);
    const walkerData: { angle: number; t: number; dir: number; speed: number }[] = [];
    for (let i = 0; i < walkerCount; i++) {
      const hub = HUBS[1 + (i % (HUBS.length - 1))]!;
      walkerData.push({ angle: hub.angle + (Math.random() - 0.5) * 0.12, t: Math.random(), dir: Math.random() > 0.5 ? 1 : -1, speed: 0.05 + Math.random() * 0.09 });
    }
    const walkerGeo = track(new THREE.BufferGeometry());
    walkerGeo.setAttribute('position', new THREE.BufferAttribute(walkerPos, 3));
    const walkerMat = track(
      new THREE.PointsMaterial({ size: 0.9, map: glowTex, color: 0xbfe9ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    const walkers = new THREE.Points(walkerGeo, walkerMat);
    scene.add(walkers);

    /* ---------------- atmosphere: floating motes + star dome ---------------- */
    const moteCount = isMobile ? 220 : 520;
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      const r = 12 + Math.random() * 55;
      const a = Math.random() * Math.PI * 2;
      motePos[i * 3] = Math.cos(a) * r;
      motePos[i * 3 + 1] = Math.random() * 42;
      motePos[i * 3 + 2] = Math.sin(a) * r;
    }
    const moteGeo = track(new THREE.BufferGeometry());
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    const moteMat = track(
      new THREE.PointsMaterial({ size: 0.55, map: glowTex, color: 0x9fd7ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    const skyGeo = track(new THREE.SphereGeometry(160, 32, 24));
    const skyMat = track(
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {},
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vP;
          void main(){
            float h = normalize(vP).y * 0.5 + 0.5;
            vec3 top = vec3(0.012, 0.020, 0.047);
            vec3 bot = vec3(0.043, 0.075, 0.129);
            vec3 col = mix(bot, top, smoothstep(0.35, 0.95, h));
            col += vec3(0.05, 0.02, 0.09) * pow(1.0 - abs(normalize(vP).y), 6.0);
            gl_FragColor = vec4(col, 1.0);
          }`,
      })
    );
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    /* ---------------- post-processing ---------------- */
    let composer: EffectComposer | null = null;
    let bloomPass: UnrealBloomPass | null = null;
    const buildComposer = () => {
      composer = new EffectComposer(renderer);
      composer.setPixelRatio(dpr);
      composer.setSize(mount.clientWidth, mount.clientHeight);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(mount.clientWidth, mount.clientHeight),
        isMobile ? 0.55 : 0.78,
        0.7,
        0.3
      );
      composer.addPass(bloomPass);
    };
    buildComposer();

    /* ---------------- interaction ---------------- */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredName: string | null = null;
    let pointerInside = false;
    let downPos = { x: 0, y: 0 };

    const setPointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerInside = true;
      setPointer(e);
    };
    const onPointerLeave = () => {
      pointerInside = false;
      hoveredName = null;
      setHovered(null);
      renderer.domElement.style.cursor = 'grab';
    };
    const onPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const flyTo = (hub: HubDef) => {
      const hx = Math.cos(hub.angle) * hub.radius;
      const hz = Math.sin(hub.angle) * hub.radius;
      const dir = new THREE.Vector3(hx, 0, hz).normalize();
      if (hub.radius === 0) dir.set(0, 0, 1);
      const dest = new THREE.Vector3(hx, 0, hz).add(dir.multiplyScalar(24)).setY(18);
      flight = { from: camera.position.clone(), to: dest, targetFrom: controls.target.clone(), targetTo: new THREE.Vector3(hx, 8, hz), t: 0 };
      controls.autoRotate = false;
    };

    const onPointerUp = (e: PointerEvent) => {
      renderer.domElement.style.cursor = 'grab';
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) return;
      setPointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickTargets, false)[0];
      const name = hit?.object.userData['hubName'] as string | undefined;
      if (!name) return;
      const hub = HUBS.find((h) => h.name === name);
      if (!hub) return;
      setFocused(name);
      flyTo(hub);
      selectRef.current?.(name);
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.style.cursor = 'grab';

    let flight: { from: THREE.Vector3; to: THREE.Vector3; targetFrom: THREE.Vector3; targetTo: THREE.Vector3; t: number } | null = null;

    /* ---------------- resize + visibility ---------------- */
    const onResize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      composer?.setSize(mount.clientWidth, mount.clientHeight);
      bloomPass?.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    let visible = true;
    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0.02 });
    io.observe(mount);

    /* ---------------- animation loop ---------------- */
    const clock = new THREE.Clock();
    let raf = 0;
    let frames = 0;
    let fpsTimer = 0;
    let degraded = false;
    const tmp = new THREE.Vector3();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      const t = clock.elapsedTime;

      // adaptive quality
      frames++;
      fpsTimer += dt;
      if (fpsTimer > 2) {
        const fps = frames / fpsTimer;
        if (!degraded && fps < 34) {
          degraded = true;
          dpr = Math.max(1, dpr * 0.7);
          renderer.setPixelRatio(dpr);
          composer?.setPixelRatio(dpr);
          if (bloomPass) bloomPass.strength *= 0.6;
        }
        frames = 0;
        fpsTimer = 0;
      }

      // camera flight
      if (flight) {
        flight.t = Math.min(1, flight.t + dt * 0.9);
        const e = 1 - Math.pow(1 - flight.t, 3);
        camera.position.lerpVectors(flight.from, flight.to, e);
        controls.target.lerpVectors(flight.targetFrom, flight.targetTo, e);
        if (flight.t >= 1) flight = null;
      }

      // hover raycast (skip while flying)
      if (pointerInside && !flight) {
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(pickTargets, false)[0];
        const name = (hit?.object.userData['hubName'] as string | undefined) ?? null;
        if (name !== hoveredName) {
          hoveredName = name;
          setHovered(HUBS.find((h) => h.name === name) ?? null);
          renderer.domElement.style.cursor = name ? 'pointer' : 'grab';
        }
      }

      // hub idle motion / hover lift
      hubGroups.forEach(({ group, hub, halo, label }, i) => {
        const isActive = hoveredName === hub.name;
        const targetY = isActive ? 1.6 : 0;
        group.position.y += (targetY - group.position.y) * Math.min(1, dt * 8);
        const pulse = 0.3 + Math.sin(t * 1.6 + i) * 0.08 + (isActive ? 0.35 : 0);
        (halo.material as THREE.SpriteMaterial).opacity = pulse;
        halo.scale.setScalar(28 + Math.sin(t * 1.2 + i) * 1.6 + (isActive ? 6 : 0));
        label.position.y += ((hub.shape === 'core' ? 34 : 28) + Math.sin(t * 1.1 + i) * 0.5 + (isActive ? 2 : 0) - label.position.y) * Math.min(1, dt * 5);
        const ls = isActive ? 19 : 16;
        label.scale.x += (ls - label.scale.x) * Math.min(1, dt * 6);
        label.scale.y = label.scale.x * 0.5;
      });

      // packets
      packets.forEach((p) => {
        p.t += dt * p.speed;
        if (p.t > 1) p.t -= 1;
        linkCurves[p.curveIdx]!.curve.getPoint(p.t, tmp);
        p.mesh.position.copy(tmp);
      });

      // shuttles
      shuttles.forEach((s) => {
        s.a += dt * s.speed * 0.35;
        s.mesh.position.set(Math.cos(s.a) * s.r, 0.45, Math.sin(s.a) * s.r);
        s.mesh.rotation.y = -s.a + (s.speed > 0 ? Math.PI / 2 : -Math.PI / 2);
      });

      // walkers along spokes
      const wpos = walkerGeo.attributes['position'] as THREE.BufferAttribute;
      for (let i = 0; i < walkerCount; i++) {
        const w = walkerData[i]!;
        w.t += dt * w.speed * w.dir;
        if (w.t > 1) w.t -= 1;
        if (w.t < 0) w.t += 1;
        const r = 9 + w.t * 16;
        wpos.setXYZ(i, Math.cos(w.angle) * r, 0.7 + Math.sin(t * 3 + i) * 0.06, Math.sin(w.angle) * r);
      }
      wpos.needsUpdate = true;

      // motes drift
      motes.rotation.y = t * 0.012;
      linkGroup.rotation.y = Math.sin(t * 0.05) * 0.01;
      ringEdge.rotation.z = t * 0.05;

      controls.update();
      if (composer) composer.render();
      else renderer.render(scene, camera);
    };

    animate();
    setReady(true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      composer?.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

      {/* readability gradients over the scene */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_45%,rgba(9,13,22,0.95)_0%,rgba(9,13,22,0.75)_42%,rgba(9,13,22,0.2)_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090d16] to-transparent" />

      {/* live hover readout */}
      <div
        className={`pointer-events-none absolute right-6 top-24 hidden max-w-[260px] rounded-2xl border px-4 py-3.5 backdrop-blur-xl transition-all duration-300 lg:block shadow-xl ${
          hovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
        style={{
          borderColor: hovered ? `${hexOf(hovered.color)}66` : 'rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(15,23,42,0.85)',
        }}
      >
        <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400" style={{ color: hovered ? hexOf(hovered.color) : '#94a3b8' }}>
          {hovered?.category ?? ''}
        </div>
        <div className="font-heading text-base font-bold text-white mt-0.5">{hovered?.name ?? ''}</div>
        <div className="text-xs text-slate-300 mt-1">{hovered?.blurb ?? ''}</div>
        <div className="text-[11px] font-semibold text-emerald-400 mt-1.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{hovered?.metric ?? ''}</span>
        </div>
      </div>

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium tracking-wider text-slate-400">Loading campus map…</span>
        </div>
      )}
    </div>
  );
}

export default Campus3DVisualizer;
