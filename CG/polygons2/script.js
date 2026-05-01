const W = 400, H = 400;

function criarPoligono() {
  const n = 5 + Math.floor(Math.random() * 6);
  const cx = W / 2, cy = H / 2;
  const pts = Array.from({ length: n }, () => {
    const angle = Math.random() * Math.PI * 2;
    const r = 60 + Math.random() * 130;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
  pts.sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
  return pts;
}


function linhaDDA(ctx, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const passos = Math.max(Math.abs(dx), Math.abs(dy));
  if (passos === 0) return;
  const xInc = dx / passos, yInc = dy / passos;
  let x = x1, y = y1;
  for (let i = 0; i <= passos; i++) {
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    x += xInc;
    y += yInc;
  }
}

function desenharManual(ctx, pontos) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, W, H);

  // preenchimento por scanline
  const ys = pontos.map((p) => p.y);
  const minY = Math.ceil(Math.min(...ys));
  const maxY = Math.floor(Math.max(...ys));
  ctx.fillStyle = "yellow";
  for (let y = minY; y <= maxY; y++) {
    const inter = [];
    for (let i = 0; i < pontos.length; i++) {
      const p1 = pontos[i], p2 = pontos[(i + 1) % pontos.length];
      if (p1.y !== p2.y && y >= Math.min(p1.y, p2.y) && y < Math.max(p1.y, p2.y))
        inter.push(p1.x + ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y));
    }
    inter.sort((a, b) => a - b);
    for (let i = 0; i < inter.length - 1; i += 2)
      linhaDDA(ctx, inter[i], y, inter[i + 1], y);
  }

  ctx.fillStyle = "black";
  for (let i = 0; i < pontos.length; i++) {
    const p1 = pontos[i], p2 = pontos[(i + 1) % pontos.length];
    linhaDDA(ctx, p1.x, p1.y, p2.x, p2.y);
  }
}


function initWebGL() {
  const canvas = document.getElementById("canvasWebGL");
  const gl = canvas.getContext("webgl");

  const vertSrc = `
    attribute vec2 pos;
    uniform vec2 resolucao;
    void main() {
      // converte pixel -> clip space (y invertido para tela normal)
      vec2 c = (pos / resolucao) * 2.0 - 1.0;
      gl_Position = vec4(c * vec2(1.0, -1.0), 0.0, 1.0);
    }
  `;
  const fragSrc = `
    precision mediump float;
    uniform vec4 cor;
    void main() { gl_FragColor = cor; }
  `;

  function compileShader(tipo, src) {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const posLoc = gl.getAttribLocation(prog, "pos");
  const resLoc = gl.getUniformLocation(prog, "resolucao");
  const corLoc = gl.getUniformLocation(prog, "cor");
  const buf = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(resLoc, W, H);

  return { gl, corLoc, buf };
}

function desenharWebGL({ gl, corLoc, buf }, pontos) {
  gl.viewport(0, 0, W, H);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, buf);

  let cx = 0, cy = 0;
  for (const p of pontos) { cx += p.x; cy += p.y; }
  cx /= pontos.length; cy /= pontos.length;
  const fill = [cx, cy];
  for (const p of pontos) fill.push(p.x, p.y);
  fill.push(pontos[0].x, pontos[0].y);

  gl.uniform4f(corLoc, 1, 1, 0, 1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fill), gl.DYNAMIC_DRAW);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, fill.length / 2);

  const line = [];
  for (const p of pontos) line.push(p.x, p.y);

  gl.uniform4f(corLoc, 0, 0, 0, 1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.DYNAMIC_DRAW);
  gl.drawArrays(gl.LINE_LOOP, 0, line.length / 2);
}


function initThreeJS() {
  const canvas = document.getElementById("canvasThree");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setSize(W, H);
  renderer.setClearColor(0xffffff);

  const camera = new THREE.OrthographicCamera(0, W, H, 0, -1, 1);
  const scene = new THREE.Scene();

  return { renderer, camera, scene };
}

function desenharThreeJS({ renderer, camera, scene }, pontos) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  });
  scene.clear();

  const fpts = pontos.map((p) => ({ x: p.x, y: H - p.y }));

  const shape = new THREE.Shape();
  shape.moveTo(fpts[0].x, fpts[0].y);
  for (let i = 1; i < fpts.length; i++) shape.lineTo(fpts[i].x, fpts[i].y);
  shape.closePath();

  scene.add(new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  ));

  const pts3 = fpts.concat(fpts[0]).map((p) => new THREE.Vector3(p.x, p.y, 0));
  scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts3),
    new THREE.LineBasicMaterial({ color: 0x000000 })
  ));

  renderer.render(scene, camera);
}

const ctxManual = document.getElementById("canvasManual").getContext("2d");
const glCtx = initWebGL();
const threeCtx = initThreeJS();

function desenharTodos(pontos) {
  desenharManual(ctxManual, pontos);
  desenharWebGL(glCtx, pontos);
  desenharThreeJS(threeCtx, pontos);
}

desenharTodos(criarPoligono());

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") executar();
});

const ITERACOES = 1000;

function rodarComRAF(desenhar) {
  return new Promise((resolve) => {
    let i = 0;
    const inicio = performance.now();
    function frame() {
      if (i >= ITERACOES) { resolve(performance.now() - inicio); return; }
      desenhar(criarPoligono());
      i++;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

async function executar() {
  const res = document.getElementById("resultados");

  res.textContent = "Manual...";
  const tManual = await rodarComRAF((p) => desenharManual(ctxManual, p));

  res.textContent = "WebGL...";
  const tWebGL = await rodarComRAF((p) => desenharWebGL(glCtx, p));

  res.textContent = "Three.js...";
  const tThree = await rodarComRAF((p) => desenharThreeJS(threeCtx, p));

  res.innerHTML =
    `${ITERACOES} iterações:<br>` +
    `Manual (DDA + Scanline): ${tManual.toFixed(1)} ms<br>` +
    `WebGL puro: ${tWebGL.toFixed(1)} ms<br>` +
    `Three.js: ${tThree.toFixed(1)} ms`;
}
