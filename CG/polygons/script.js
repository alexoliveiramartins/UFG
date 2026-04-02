function random(max) {
  return Math.floor(Math.random() * max);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// deixa as coordenadas (0,0) em baixo na esquerda
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

function desenharPontos(x, y, xc, yc, px) {
  ctx.fillRect(x + xc, y + yc, px, px);
  ctx.fillRect(x - xc, y + yc, px, px);
  ctx.fillRect(x + xc, y - yc, px, px);
  ctx.fillRect(x - xc, y - yc, px, px);
  ctx.fillRect(x + yc, y + xc, px, px);
  ctx.fillRect(x - yc, y + xc, px, px);
  ctx.fillRect(x + yc, y - xc, px, px);
  ctx.fillRect(x - yc, y - xc, px, px);
}

function circBrasenham(x, y, r) {
  let yc = r;
  let xc = 0;
  ctx.fillRect(xc, yc, 2, 2);
  let d = 3 - 2 * r;
  while (xc <= yc) {
    if (d < 0) {
      d = d + 4 * xc + 6;
      desenharPontos(x, y, xc, yc, 1);
    } else {
      d = d + 4 * (xc - yc) + 10;
      yc = yc - 1;
      desenharPontos(x, y, xc, yc, 1);
    }
    xc = xc + 1;
  }
}

function linhaDDA(x1, y1, x2, y2) {
  const [dx, dy] = [x2 - x1, y2 - y1];
  const passos = Math.max(Math.abs(dx), Math.abs(dy));
  const xInc = dx / passos;
  const yInc = dy / passos;
  let [x, y] = [x1, y1];
  for (let i = 0; i <= passos; i++) {
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    x += xInc;
    y += yInc;
  }
}

function desenharPoligono(pontos, corLinha, corPreenchimento) {
  const ys = pontos.map((p) => p.y);
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];

  ctx.fillStyle = corPreenchimento;
  for (let y = minY; y <= maxY; y++) {
    const inter = [];
    for (let i = 0; i < pontos.length; i++) {
      const p1 = pontos[i];
      const p2 = pontos[(i + 1) % pontos.length];
      if (
        p1.y !== p2.y &&
        y >= Math.min(p1.y, p2.y) &&
        y < Math.max(p1.y, p2.y)
      )
        inter.push(p1.x + ((y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y));
    }
    inter.sort((a, b) => a - b);
    for (let i = 0; i < inter.length; i += 2)
      linhaDDA(inter[i], y, inter[i + 1], y);
  }

  ctx.fillStyle = corLinha;
  for (let i = 0; i < pontos.length; i++) {
    const p1 = pontos[i],
      p2 = pontos[(i + 1) % pontos.length];
    linhaDDA(p1.x, p1.y, p2.x, p2.y);
  }
}

function criarPoligono() {
  const n = 3 + random(8);
  return Array.from({ length: n }, () => ({
    x: random(canvas.width),
    y: random(canvas.height),
  }));
}

document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cor = () => `rgb(${random(256)},${random(256)},${random(256)})`;
  desenharPoligono(criarPoligono(), cor(), cor());
});

// https://www.geeksforgeeks.org/computer-graphics/dda-line-generation-algorithm-computer-graphics/
