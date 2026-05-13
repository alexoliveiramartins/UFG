const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function linhaDDA(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const passos = Math.max(Math.abs(dx), Math.abs(dy));

  if (passos === 0) {
    ctx.fillRect(Math.round(x1), Math.round(y1), 2, 2);
    return;
  }

  const xInc = dx / passos;
  const yInc = dy / passos;
  let x = x1;
  let y = y1;

  for (let i = 0; i <= passos; i++) {
    ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
    x += xInc;
    y += yInc;
  }
}

function bezier(delta_t, b0_x, b0_y, b1_x, b1_y, b2_x, b2_y){
  // so para visualizar os pontos
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(b0_x, b0_y, 4, 4);
  ctx.fillRect(b1_x, b1_y, 4, 4);
  ctx.fillRect(b2_x, b2_y, 4, 4);

  ctx.fillStyle = "#000000";
  let p_1, p_2, prev_x = b0_x, prev_y = b0_y
  for(t = 0; t < 1; t+= delta_t){
    p_1 = Math.pow((1-t), 2) * b0_x + 2*t*(1-t)*b1_x + Math.pow(t, 2) * b2_x
    p_2 = Math.pow((1-t), 2) * b0_y + 2*t*(1-t)*b1_y + Math.pow(t, 2) * b2_y
    // console.log(p_1, p_2)
    // sleep(1000)
    ctx.fillRect(p_1, p_2, 2, 2);
    linhaDDA(prev_x, prev_y, p_1, p_2)
    prev_x = p_1
    prev_y = p_2
  }
  // linha pra ligar o ponto final
  linhaDDA(prev_x, prev_y, b2_x, b2_y)  
}

// 0.05, 0.01, 0.005 e 0.001, 
// bezier(0.05, 50, 100, 300, 50, 550, 100)
// bezier(0.01, 50, 100, 300, 50, 550, 100)
// bezier(0.005, 50, 100, 300, 50, 550, 100)
// bezier(0.001, 50, 100, 300, 50, 550, 100)

// <300,150>, <50, 150>, <1, 150>, <600, 50>.
// bezier(0.001, 50, 100, 300, 150, 550, 100)
// bezier(0.001, 50, 100, 50, 150, 550, 100)
// bezier(0.001, 50, 100, 1, 150, 550, 100)
bezier(0.05, 50, 100, 600, 50, 550, 100)


// ========================================
// Codigo da(s) atividades anteriores
// ========================================

const TRANSLATE_STEP = 10;
const ROTATE_STEP = 5;
const SCALE_STEP = 0.1;
const CAVALIER_ANGLE = Math.PI / 4;
const CAVALIER_FACTOR = 0.5;

function grausParaRad(graus) {
  return (graus * Math.PI) / 180;
}

function aplicarTransformacoes([x, y, z], obj) {
  x *= obj.Sx;
  y *= obj.Sy;
  z *= obj.Sz;

  const rx = grausParaRad(obj.Rx);
  let cos = Math.cos(rx);
  let sin = Math.sin(rx);
  [y, z] = [y * cos - z * sin, y * sin + z * cos];

  const ry = grausParaRad(obj.Ry);
  cos = Math.cos(ry);
  sin = Math.sin(ry);
  [x, z] = [x * cos + z * sin, -x * sin + z * cos];

  const rz = grausParaRad(obj.Rz);
  cos = Math.cos(rz);
  sin = Math.sin(rz);
  [x, y] = [x * cos - y * sin, x * sin + y * cos];

  return [x + obj.Tx, y + obj.Ty, z + obj.Tz];
}

function projetarCavaleira([x, y, z]) {
  return {
    x: x + CAVALIER_FACTOR * z * Math.cos(CAVALIER_ANGLE),
    y: y + CAVALIER_FACTOR * z * Math.sin(CAVALIER_ANGLE),
  };
}


function desenharObjeto() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const transformados = objeto.pontos.map((p) =>
    aplicarTransformacoes(p, objeto),
  );
  const projetados = transformados.map(projetarCavaleira);
  const escala = 1;
  const pontosTela = projetados.map((p) => paraTela(p, escala));

  ctx.fillStyle = "black";
  for (const [a, b] of objeto.linhas) {
    const p1 = pontosTela[a];
    const p2 = pontosTela[b];
    linhaDDA(p1.x, p1.y, p2.x, p2.y);
  }
}

function mudarEscala(eixo, delta) {
  const campo = `S${eixo}`;
  objeto[campo] = Math.max(0.1, Number((objeto[campo] + delta).toFixed(1)));
}

function normalizarRotacoes() {
  for (const campo of ["Rx", "Ry", "Rz"]) {
    objeto[campo] = ((objeto[campo] % 360) + 360) % 360;
  }
}