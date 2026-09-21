import fs from 'fs';

const BOWLS = [
  { id: 'xl',    cx: -6.75, cz: 0, bowlR: 2.1, bowlH: 1.0, ballR: 0.45, count: 14 },
  { id: 'large', cx: -2.25, cz: 0, bowlR: 2.1, bowlH: 1.0, ballR: 0.35, count: 30 },
  { id: 'med',   cx: 2.25,  cz: 0, bowlR: 2.1, bowlH: 1.0, ballR: 0.22, count: 65 },
  { id: 'small', cx: 6.75,  cz: 0, bowlR: 2.1, bowlH: 1.0, ballR: 0.14, count: 160 },
];

const MASS_SCALE = 1.0;
const GRAVITY = -14;
const RESTITUTION = 0.35;
const FRICTION = 0.985;
const allBalls = [];

BOWLS.forEach((bowl, bIdx) => {
  for (let i = 0; i < bowl.count; i++) {
    const angle = i * 2.39996;
    const r = bowl.ballR;
    const vol = (4 / 3) * Math.PI * r * r * r;
    const dist = ((i * 7) % 19) / 19 * (bowl.bowlR - r - 0.2);
    allBalls.push({
      radius: r,
      mass: vol * MASS_SCALE,
      px: bowl.cx + Math.cos(angle) * dist,
      py: bowl.bowlH + 0.5 + ((i * 13) % 40) / 10,
      pz: bowl.cz + Math.sin(angle) * dist,
      vx: 0,
      vy: -0.2,
      vz: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      bowlIdx: bIdx
    });
  }
});

function stepPhysics(balls, dt) {
  const n = balls.length;
  for (let i = 0; i < n; i++) balls[i].vy += GRAVITY * dt;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = balls[i], bb = balls[j];
      const dx = a.px - bb.px, dy = a.py - bb.py, dz = a.pz - bb.pz;
      const distSq = dx * dx + dy * dy + dz * dz;
      const minDist = a.radius + bb.radius;
      if (distSq < minDist * minDist && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const nx = dx / dist, ny = dy / dist, nz = dz / dist;
        const overlap = minDist - dist;
        const totalMass = a.mass + bb.mass;
        const rA = bb.mass / totalMass, rB = a.mass / totalMass;
        a.px += nx * overlap * rA * 0.85; a.py += ny * overlap * rA * 0.85; a.pz += nz * overlap * rA * 0.85;
        bb.px -= nx * overlap * rB * 0.85; bb.py -= ny * overlap * rB * 0.85; bb.pz -= nz * overlap * rB * 0.85;
        const dvx = a.vx - bb.vx, dvy = a.vy - bb.vy, dvz = a.vz - bb.vz;
        const dvDotN = dvx * nx + dvy * ny + dvz * nz;
        if (dvDotN < 0) {
          const imp = -(1 + RESTITUTION) * dvDotN / (1 / a.mass + 1 / bb.mass);
          a.vx += (imp / a.mass) * nx; a.vy += (imp / a.mass) * ny; a.vz += (imp / a.mass) * nz;
          bb.vx -= (imp / bb.mass) * nx; bb.vy -= (imp / bb.mass) * ny; bb.vz -= (imp / bb.mass) * nz;
        }
      }
    }
  }
  for (let i = 0; i < n; i++) {
    const b = balls[i];
    const bowl = BOWLS[b.bowlIdx];
    const bcx = bowl.cx, bcz = bowl.cz;
    const bowlInner = bowl.bowlR - 0.12;
    b.vx *= FRICTION; b.vy *= FRICTION; b.vz *= FRICTION;
    b.px += b.vx * dt; b.py += b.vy * dt; b.pz += b.vz * dt;
    if (b.py - b.radius < 0) {
      b.py = b.radius;
      b.vy = Math.abs(b.vy) * RESTITUTION;
      b.vx *= 0.96; b.vz *= 0.96;
      if (Math.abs(b.vy) < 0.1) b.vy = 0;
    }
    const localX = b.px - bcx, localZ = b.pz - bcz;
    const distXZ = Math.sqrt(localX * localX + localZ * localZ);
    const maxD = bowlInner - b.radius;
    if (distXZ > maxD && distXZ > 0.001) {
      const nx = localX / distXZ, nz = localZ / distXZ;
      b.px = bcx + nx * maxD; b.pz = bcz + nz * maxD;
      const vDotN = b.vx * nx + b.vz * nz;
      if (vDotN > 0) {
        b.vx -= 2 * vDotN * nx * (1 - RESTITUTION * 0.4);
        b.vz -= 2 * vDotN * nz * (1 - RESTITUTION * 0.4);
      }
      b.vx *= 0.94; b.vz *= 0.94;
    }
    if (b.py > 10) { b.py = 10; b.vy *= -0.2; }
    b.rx += (b.vy * dt) / (b.radius || 1) * 0.35;
    b.ry += (b.vx * dt) / (b.radius || 1) * 0.35;
    b.rz += (b.vz * dt) / (b.radius || 1) * 0.25;
  }
}

for (let s = 0; s < 320; s++) stepPhysics(allBalls, 0.022);

const r = (v) => Math.round(v * 1000) / 1000;
const settled = allBalls.map(b => [r(b.px), r(b.py), r(b.pz), r(b.rx), r(b.ry), r(b.rz)]);
fs.writeFileSync('src/data/settledBalls.json', JSON.stringify(settled));
console.log('Successfully precomputed settled balls -> src/data/settledBalls.json, count:', settled.length);
