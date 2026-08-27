const canvas = document.querySelector('#bouquet');
const ctx = canvas.getContext('2d', { alpha: false });
const paletteName = document.querySelector('#paletteName');
const palettes = [
  { name: 'BLUSH ROSE', petal: ['#e93768', '#ff85a4', '#fff0f1'], leaf: ['#4e6959', '#d3dfd2'], stem: ['#294d3c', '#88a38b'], wrap: ['#4a132d', '#b44a6d'] },
  { name: 'CRIMSON GOLD', petal: ['#a40f36', '#ee5d70', '#ffe0b6'], leaf: ['#586048', '#d0d4b9'], stem: ['#304c31', '#91a96b'], wrap: ['#431120', '#c34855'] },
  { name: 'MOONLIT LILAC', petal: ['#743bb0', '#c58ce8', '#fae9ff'], leaf: ['#506873', '#cedde0'], stem: ['#315051', '#80a09f'], wrap: ['#32174b', '#a24d9f'] }
];

let paletteIndex = 0;
let particles = [];
let startedAt = performance.now();
let randomSeed = 20260811;
const mobile = window.matchMedia('(max-width: 760px)').matches;

function random() {
  randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0;
  return randomSeed / 4294967296;
}

function between(min, max) { return min + (max - min) * random(); }

function addParticle(x, y, z, role, tone, birth, size = 1) {
  particles.push({ x, y, z, role, tone, birth, size, phase: between(0, Math.PI * 2), sx: x * between(.02, .12), sy: -220, sz: z * between(.02, .12) });
}

function buildBouquet() {
  particles = [];
  randomSeed = 20260811;
  const centers = [[-145, 165, -10], [0, 205, 48], [145, 170, 0], [-215, 82, 32], [-100, 78, 88], [18, 92, 116], [132, 82, 82], [225, 90, 28], [-120, 274, -8], [0, 294, 35], [118, 276, -18]];

  centers.forEach((center, bloomIndex) => {
    const [cx, cy, cz] = center;
    const radius = 68 + 14 * Math.sin(bloomIndex * 1.7) ** 2;
    for (let layer = 0; layer < 5; layer++) {
      const petalCount = 3 + layer * 2;
      for (let petal = 0; petal < petalCount; petal++) {
        for (let iu = 0; iu < 3; iu++) {
          for (const v0 of [-1, 0, 1]) {
            const u = (iu + .45 + random() * .2) / 3;
            const v = v0 + between(-.05, .05);
            const angle = Math.PI * 2 * petal / petalCount + layer * .73 + between(-.035, .035);
            const radial = radius * (.04 + layer * .085) + radius * (.22 + layer * .035) * u;
            const theta = angle + (.48 - layer * .052) * (1 - u);
            const width = radius * (.1 + layer * .017) * Math.max(.05, Math.sin(Math.PI * u)) ** .75;
            const across = v * width;
            const x = cx + radial * Math.cos(theta) - across * Math.sin(theta);
            const y = cy + (radial * Math.sin(theta) + across * Math.cos(theta)) * .92;
            const z = cz + radius * (.49 - layer * .06) * (1 - u) + radius * .08 * (1 - v * v) * Math.sin(Math.PI * u);
            addParticle(x, y, z, 0, .1 + layer * .1 + u * .25, 1.1 + bloomIndex * .34 + layer * .23 + u * .15, Math.abs(v0) ? 2.4 : .9);
          }
        }
      }
    }
    for (let i = 0; i < 72; i++) {
      const t = i / 71;
      const angle = t * Math.PI * 2 * 2.35 + .55;
      const radial = radius * (.025 + .285 * t);
      addParticle(cx + Math.cos(angle) * radial, cy + Math.sin(angle) * radial * .88, cz + radius * (.46 - .22 * t), 0, .06 + t * .26, .9 + bloomIndex * .34 + t * .5, 2.5);
    }
  });

  const foliageCount = mobile ? 520 : 1050;
  for (let i = 0; i < foliageCount; i++) {
    const angle = random() * Math.PI * 2;
    const radial = 282 * Math.sqrt(random());
    const x = Math.cos(angle) * radial;
    const z = Math.sin(angle) * radial;
    const y = Math.max(-86, Math.min(96, 27 - Math.max(0, radial - 105) * .1 + between(-29, 29)));
    addParticle(x, y, z, random() > .25 ? 1 : 2, between(.35, 1), 1.5 + random() * 4.4, between(.5, 1.1));
  }

  const outerCount = mobile ? 260 : 560;
  for (let i = 0; i < outerCount; i++) {
    const angle = random() * Math.PI * 2;
    const radial = between(180, 330);
    addParticle(Math.cos(angle) * radial, between(-30, 260), Math.sin(angle) * radial * .55, 2, random(), 2 + random() * 4, between(.5, 1.5));
  }

  const ribbonCount = mobile ? 180 : 360;
  for (let i = 0; i < ribbonCount; i++) {
    const angle = random() * Math.PI * 2;
    const radial = between(20, 115);
    addParticle(Math.cos(angle) * radial, between(-245, -92), Math.sin(angle) * radial, 3, random(), .5 + random() * 2, between(.7, 1.5));
  }
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function rgba(hex, alpha) {
  const value = parseInt(hex.slice(1), 16);
  return `rgba(${value >> 16},${value >> 8 & 255},${value & 255},${alpha})`;
}

function draw(now) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const elapsed = (now - startedAt) / 1000;
  const angle = elapsed * .16;
  const scale = Math.min(width / 700, height / 620);
  const centerX = width / 2;
  const centerY = height * .51;
  const palette = palettes[paletteIndex];

  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';
  for (const particle of particles) {
    const progress = Math.max(0, Math.min(1, (elapsed - particle.birth) / 1.2));
    const eased = progress * progress * (3 - 2 * progress);
    const x = particle.sx + (particle.x - particle.sx) * eased;
    const y = particle.sy + (particle.y - particle.sy) * eased;
    const z = particle.sz + (particle.z - particle.sz) * eased;
    const rotatedX = x * Math.cos(angle) - z * Math.sin(angle);
    const rotatedZ = x * Math.sin(angle) + z * Math.cos(angle);
    const perspective = 1 / (1 + (rotatedZ + 300) / 900);
    const screenX = centerX + rotatedX * scale * perspective;
    const screenY = centerY - y * scale * perspective * .82;
    const alpha = (.25 + .75 * eased) * (.4 + .5 * perspective);
    const colors = particle.role === 0 ? palette.petal : particle.role === 1 ? palette.leaf : particle.role === 2 ? palette.stem : palette.wrap;
    const color = colors[Math.min(colors.length - 1, Math.floor(particle.tone * colors.length))];
    ctx.fillStyle = rgba(color, alpha * (.82 + .18 * Math.sin(elapsed * 2 + particle.phase)));
    ctx.beginPath();
    ctx.arc(screenX, screenY, Math.max(.45, particle.size * scale * perspective), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(draw);
}

document.querySelector('#bloom').onclick = () => { startedAt = performance.now(); };
document.querySelector('#palette').onclick = () => { paletteIndex = (paletteIndex + 1) % palettes.length; paletteName.textContent = palettes[paletteIndex].name; };
window.addEventListener('resize', resizeCanvas);
buildBouquet();
resizeCanvas();
requestAnimationFrame(draw);
