import * as THREE from 'three';

const CANVAS_W = 500;
const CANVAS_H = 500;
const ITERATIONS = 1000;

function random(max) { return Math.floor(Math.random() * max); }

// Gera polígono com 5-10 vértices (não auto-intersectante)
function criarPoligono() {
  const n = 5 + random(6);
  const cx = CANVAS_W / 2, cy = CANVAS_H / 2, baseR = 150;
  const pontos = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n + (Math.random() - 0.5) * (0.6 * Math.PI / n);
    const r = baseR * (0.5 + Math.random() * 0.5);
    pontos.push({ x: Math.round(cx + r * Math.cos(angle)), y: Math.round(cy + r * Math.sin(angle)) });
  }
  return pontos;
}

/* ===================== MANUAL (DDA + Scanline) ===================== */
function benchManual(pontos) {
  const canvas = document.getElementById('canvasManual');
  const ctx = canvas.getContext('2d');

  function setPixel(d, x, y, r, g, b) {
    if (x < 0 || x >= CANVAS_W || y < 0 || y >= CANVAS_H) return;
    const i = (y * CANVAS_W + x) * 4;
    d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255;
  }

  function linhaDDA(d, x1, y1, x2, y2, r, g, b) {
    const dx = x2 - x1, dy = y2 - y1;
    const passos = Math.max(Math.abs(dx), Math.abs(dy));
    if (passos === 0) { setPixel(d, Math.round(x1), Math.round(y1), r, g, b); return; }
    const xInc = dx / passos, yInc = dy / passos;
    let x = x1, y = y1;
    for (let i = 0; i <= passos; i++) {
      setPixel(d, Math.round(x), Math.round(y), r, g, b);
      x += xInc; y += yInc;
    }
  }

  function desenharPoligono(d, pts) {
    const ys = pts.map(p => p.y);
    const minY = Math.max(0, Math.min(...ys));
    const maxY = Math.min(CANVAS_H - 1, Math.max(...ys));
    for (let y = minY; y <= maxY; y++) {
      const inter = [];
      for (let i = 0; i < pts.length; i++) {
        const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
        if (p1.y !== p2.y && y >= Math.min(p1.y, p2.y) && y < Math.max(p1.y, p2.y))
          inter.push(p1.x + ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y));
      }
      inter.sort((a, b) => a - b);
      for (let i = 0; i < inter.length; i += 2)
        if (i + 1 < inter.length) linhaDDA(d, Math.round(inter[i]), y, Math.round(inter[i+1]), y, 255, 255, 0);
    }
    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i], p2 = pts[(i + 1) % pts.length];
      linhaDDA(d, p1.x, p1.y, p2.x, p2.y, 0, 0, 0);
    }
  }

  const t0 = performance.now();
  for (let iter = 0; iter < ITERATIONS; iter++) {
    const img = ctx.createImageData(CANVAS_W, CANVAS_H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) { d[i] = 255; d[i+1] = 255; d[i+2] = 255; d[i+3] = 255; }
    desenharPoligono(d, pontos);
    ctx.putImageData(img, 0, 0);
  }
  return performance.now() - t0;
}

/* ===================== Triangulação Ear-Clipping ===================== */
function triangulate(verts) {
  if (verts.length < 3) return [];
  function area2(pts) {
    let a = 0;
    for (let i = 0; i < pts.length; i++) { const j = (i+1) % pts.length; a += pts[i].x * pts[j].y - pts[j].x * pts[i].y; }
    return a;
  }
  function cross(o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
  function inTri(p, a, b, c) {
    const d1 = cross(p,a,b), d2 = cross(p,b,c), d3 = cross(p,c,a);
    return !((d1<0||d2<0||d3<0) && (d1>0||d2>0||d3>0));
  }
  const ccw = area2(verts) > 0;
  const rem = verts.map((_,i) => i);
  const tris = [];
  let safe = rem.length * rem.length;
  while (rem.length > 3 && safe-- > 0) {
    let found = false;
    for (let i = 0; i < rem.length; i++) {
      const pi = (i-1+rem.length)%rem.length, ni = (i+1)%rem.length;
      const a = verts[rem[pi]], b = verts[rem[i]], c = verts[rem[ni]];
      const cr = cross(a, b, c);
      if ((ccw && cr <= 0) || (!ccw && cr >= 0)) continue;
      let ear = true;
      for (let j = 0; j < rem.length; j++) {
        if (j===pi||j===i||j===ni) continue;
        if (inTri(verts[rem[j]], a, b, c)) { ear = false; break; }
      }
      if (ear) { tris.push(rem[pi], rem[i], rem[ni]); rem.splice(i, 1); found = true; break; }
    }
    if (!found) break;
  }
  if (rem.length === 3) tris.push(rem[0], rem[1], rem[2]);
  return tris;
}

/* ===================== WebGL ===================== */
function benchWebGL(pontos) {
  const canvas = document.getElementById('canvasWebGL');
  const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
  if (!gl) { alert('WebGL indisponível'); return -1; }

  const vsSrc = `attribute vec2 a_pos; uniform vec2 u_res;
    void main(){ vec2 n=(a_pos/u_res)*2.0-1.0; gl_Position=vec4(n.x,-n.y,0,1); }`;
  const fsSrc = `precision mediump float; uniform vec4 u_color;
    void main(){ gl_FragColor=u_color; }`;

  function mkS(t, s) { const sh=gl.createShader(t); gl.shaderSource(sh,s); gl.compileShader(sh); return sh; }
  const vs = mkS(gl.VERTEX_SHADER, vsSrc), fs = mkS(gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog); gl.useProgram(prog);

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uCol = gl.getUniformLocation(prog, 'u_color');
  gl.uniform2f(uRes, CANVAS_W, CANVAS_H);
  gl.enableVertexAttribArray(aPos);
  gl.viewport(0, 0, CANVAS_W, CANVAS_H);

  const triIdx = triangulate(pontos);
  const fArr = new Float32Array(triIdx.length * 2);
  for (let i = 0; i < triIdx.length; i++) { fArr[i*2] = pontos[triIdx[i]].x; fArr[i*2+1] = pontos[triIdx[i]].y; }
  const fBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, fBuf); gl.bufferData(gl.ARRAY_BUFFER, fArr, gl.STATIC_DRAW);

  const lArr = new Float32Array(pontos.length * 2);
  for (let i = 0; i < pontos.length; i++) { lArr[i*2] = pontos[i].x; lArr[i*2+1] = pontos[i].y; }
  const lBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, lBuf); gl.bufferData(gl.ARRAY_BUFFER, lArr, gl.STATIC_DRAW);

  const t0 = performance.now();
  for (let iter = 0; iter < ITERATIONS; iter++) {
    gl.clearColor(1,1,1,1); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform4f(uCol, 1,1,0,1);
    gl.bindBuffer(gl.ARRAY_BUFFER, fBuf); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, triIdx.length);
    gl.uniform4f(uCol, 0,0,0,1);
    gl.bindBuffer(gl.ARRAY_BUFFER, lBuf); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, 0, pontos.length);
  }
  gl.finish();
  const t1 = performance.now();
  gl.deleteBuffer(fBuf); gl.deleteBuffer(lBuf); gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs);
  return t1 - t0;
}

/* ===================== Three.js ===================== */
function benchThree(pontos) {
  const canvas = document.getElementById('canvasThree');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setSize(CANVAS_W, CANVAS_H);
  renderer.setClearColor(0xffffff, 1);

  const scene = new THREE.Scene();
  // Camera com Y invertido para coordenadas de canvas (y=0 no topo)
  const camera = new THREE.OrthographicCamera(0, CANVAS_W, 0, CANVAS_H, -1, 1);

  const shape = new THREE.Shape();
  shape.moveTo(pontos[0].x, pontos[0].y);
  for (let i = 1; i < pontos.length; i++) shape.lineTo(pontos[i].x, pontos[i].y);
  shape.closePath();

  const fillGeo = new THREE.ShapeGeometry(shape);
  const fillMat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
  scene.add(new THREE.Mesh(fillGeo, fillMat));

  const lPts = pontos.map(p => new THREE.Vector3(p.x, p.y, 0));
  lPts.push(new THREE.Vector3(pontos[0].x, pontos[0].y, 0));
  const lineGeo = new THREE.BufferGeometry().setFromPoints(lPts);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
  scene.add(new THREE.Line(lineGeo, lineMat));

  const t0 = performance.now();
  for (let iter = 0; iter < ITERATIONS; iter++) renderer.render(scene, camera);
  renderer.getContext().finish();
  const t1 = performance.now();

  fillGeo.dispose(); fillMat.dispose(); lineGeo.dispose(); lineMat.dispose(); renderer.dispose();
  return t1 - t0;
}

/* ===================== WebGPU via Three.js (opcional) ===================== */
async function benchWebGPU(pontos) {
  if (!navigator.gpu) return null;
  try {
    const { default: WebGPURenderer } = await import('three/addons/renderers/webgpu/WebGPURenderer.js');
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W; canvas.height = CANVAS_H;
    document.getElementById('canvasThree').parentNode.appendChild(canvas);

    const renderer = new WebGPURenderer({ canvas, antialias: false });
    await renderer.init();
    renderer.setSize(CANVAS_W, CANVAS_H);
    renderer.setClearColor(0xffffff, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, CANVAS_W, 0, CANVAS_H, -1, 1);

    const shape = new THREE.Shape();
    shape.moveTo(pontos[0].x, pontos[0].y);
    for (let i = 1; i < pontos.length; i++) shape.lineTo(pontos[i].x, pontos[i].y);
    shape.closePath();
    const fillGeo = new THREE.ShapeGeometry(shape);
    const fillMat = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    scene.add(new THREE.Mesh(fillGeo, fillMat));

    const lPts = pontos.map(p => new THREE.Vector3(p.x, p.y, 0));
    lPts.push(new THREE.Vector3(pontos[0].x, pontos[0].y, 0));
    const lineGeo = new THREE.BufferGeometry().setFromPoints(lPts);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    scene.add(new THREE.Line(lineGeo, lineMat));

    const t0 = performance.now();
    for (let iter = 0; iter < ITERATIONS; iter++) renderer.render(scene, camera);
    await renderer.getContext().queue?.onSubmittedWorkDone?.();
    const t1 = performance.now();

    fillGeo.dispose(); fillMat.dispose(); lineGeo.dispose(); lineMat.dispose(); renderer.dispose();
    canvas.remove();
    return t1 - t0;
  } catch (e) {
    console.warn('WebGPU não disponível:', e);
    return null;
  }
}

/* ===================== Main ===================== */
const btn = document.getElementById('btnExecutar');
const status = document.getElementById('statusMsg');

btn.addEventListener('click', async () => {
  btn.disabled = true;
  status.textContent = 'Gerando polígono...';

  const pontos = criarPoligono();
  document.getElementById('verticesInfo').textContent =
    `${pontos.length} vértices: ` + pontos.map((p,i) => `V${i}(${p.x},${p.y})`).join(', ');

  await new Promise(r => setTimeout(r, 50));

  status.textContent = 'Executando Manual (DDA + Scanline)...';
  await new Promise(r => setTimeout(r, 50));
  const tM = benchManual(pontos);
  document.getElementById('tempoManual').textContent = `Tempo: ${tM.toFixed(2)} ms`;

  status.textContent = 'Executando WebGL...';
  await new Promise(r => setTimeout(r, 50));
  const tW = benchWebGL(pontos);
  document.getElementById('tempoWebGL').textContent = `Tempo: ${tW.toFixed(2)} ms`;

  status.textContent = 'Executando Three.js...';
  await new Promise(r => setTimeout(r, 50));
  const tT = benchThree(pontos);
  document.getElementById('tempoThree').textContent = `Tempo: ${tT.toFixed(2)} ms`;

  // Tenta WebGPU (opcional)
  status.textContent = 'Verificando WebGPU...';
  await new Promise(r => setTimeout(r, 50));
  const tG = await benchWebGPU(pontos);

  // Tabela de resultados
  document.getElementById('resManual').textContent = tM.toFixed(2);
  document.getElementById('resManualMedia').textContent = (tM / ITERATIONS).toFixed(4);
  document.getElementById('resWebGL').textContent = tW.toFixed(2);
  document.getElementById('resWebGLMedia').textContent = (tW / ITERATIONS).toFixed(4);
  document.getElementById('resThree').textContent = tT.toFixed(2);
  document.getElementById('resThreeMedia').textContent = (tT / ITERATIONS).toFixed(4);

  if (tG !== null) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>Three.js (WebGPU/Vulkan)</td><td>${tG.toFixed(2)}</td><td>${(tG/ITERATIONS).toFixed(4)}</td>`;
    document.getElementById('tabelaResultados').querySelector('tbody').appendChild(row);
  } else {
    const note = document.createElement('p');
    note.textContent = 'WebGPU não disponível neste navegador. Para Vulkan via WebGPU, use Chrome 113+ com flag --enable-unsafe-webgpu.';
    note.style.color = '#888'; note.style.fontStyle = 'italic';
    document.getElementById('resultados').appendChild(note);
  }

  status.textContent = 'Concluído!';
  btn.disabled = false;
});
