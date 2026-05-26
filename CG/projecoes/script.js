const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");
const helpEl = document.getElementById("help");
const projecaoEl = document.getElementById("projecao");

// deixa as coordenadas (0,0) em baixo na esquerda
// ctx.translate(0, canvas.height);
// ctx.scale(1, -1);

const TRANSLATE_STEP = 10;
const ROTATE_STEP = 5;
const SCALE_STEP = 0.1;
const CAVALIER_ANGLE = Math.PI / 4;
const CAVALIER_FACTOR = 0.5;
let projecao_atual = 0

let objeto = criarCubo();
let backup = objeto

const obliquaCavaleira = ([x, y, z]) => {
  x = x + z * Math.cos(grausParaRad(45))
  y = y + z * Math.cos(grausParaRad(45))
  return {x, y}
}

const paralelaObliquaCabinet = ([x, y, z]) => {
  const L = 0.5
  x = x + z * L * Math.cos(grausParaRad(45))
  y = y + z * L * Math.sin(grausParaRad(45))
  return {x, y}
}

const ortograficaIsometrica = ([x, y, z]) => {
  x = (x-z) * Math.cos(grausParaRad(30))
  y = y + (x + z) * Math.sin(grausParaRad(30))
  return {x, y}
}

// inverter y?
const pontoFugaZ = ([x, y, z]) => {
  const d = 500 // mudar dps
  x = x / (1 + z / d)
  y = y / (1 + z / d)
  return {x, y}
}

const pontoFugaXZ = ([x, y, z]) => {
  const dX = 500
  const dZ = 500
  fator_x = dX / (dX + x) 
  fator_z = dZ / (dZ + z)

  x = x * fator_z
  y = y * fator_x * fator_z
  return {x, y}
}

const cavaleira = ([x, y, z]) => {
  x = x + CAVALIER_FACTOR * z * Math.cos(CAVALIER_ANGLE)
  y = y + CAVALIER_FACTOR * z * Math.sin(CAVALIER_ANGLE)
  return {x, y}
}

const projecoes = [
  cavaleira,
  obliquaCavaleira,
  paralelaObliquaCabinet,
  ortograficaIsometrica,
  pontoFugaZ,
  pontoFugaXZ,
]

function criarObjeto3D(pontos, linhas) {
  return {
    n: pontos.length,
    m: linhas.length,
    pontos,
    linhas,
    Tx: 0,
    Ty: 0,
    Tz: 0,
    Rx: 0,
    Ry: 0,
    Rz: 0,
    Sx: 1,
    Sy: 1,
    Sz: 1,
  };
}

function criarCubo() {
  const s = 80;
  return criarObjeto3D(
    [ // ponto
      [-s, -s, -s],
      [s, -s, -s],
      [s, s, -s],
      [-s, s, -s],
      [-s, -s, s],
      [s, -s, s],
      [s, s, s],
      [-s, s, s],
    ],
    [ // linhas
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ],
  );
}

// console.log(objeto.pontos)

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

function paraTela(ponto, escala) {
  return {
    x: canvas.width / 2 + ponto.x * escala,
    y: canvas.height / 2 - ponto.y * escala,
  };
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

function desenharObjeto() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const transformados = objeto.pontos.map((p) =>
    aplicarTransformacoes(p, objeto),
  );
  const projetados = transformados.map((ponto) => projecoes[projecao_atual](ponto));
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

function aplicarComando(tecla) {
  const comandos = {
    a: () => (objeto.Tx -= TRANSLATE_STEP),
    d: () => (objeto.Tx += TRANSLATE_STEP),
    s: () => (objeto.Ty -= TRANSLATE_STEP),
    w: () => (objeto.Ty += TRANSLATE_STEP),
    q: () => (objeto.Tz -= TRANSLATE_STEP),
    e: () => (objeto.Tz += TRANSLATE_STEP),
    i: () => (objeto.Rx += ROTATE_STEP),
    k: () => (objeto.Rx -= ROTATE_STEP),
    j: () => (objeto.Ry -= ROTATE_STEP),
    l: () => (objeto.Ry += ROTATE_STEP),
    u: () => (objeto.Rz -= ROTATE_STEP),
    o: () => (objeto.Rz += ROTATE_STEP),
    v: () => mudarEscala("x", -SCALE_STEP),
    b: () => mudarEscala("x", SCALE_STEP),
    n: () => mudarEscala("y", -SCALE_STEP),
    m: () => mudarEscala("y", SCALE_STEP),
    x: () => mudarEscala("z", -SCALE_STEP),
    c: () => mudarEscala("z", SCALE_STEP),
    p: () => { 
      projecao_atual = (projecao_atual + 1) % projecoes.length
      alternarProjecao();
    },
  };

  if (!comandos[tecla]) return false;
  comandos[tecla]();
  normalizarRotacoes();
  desenharObjeto();
  return true;
}

function changePerspective(){
  objeto = backup
  f = projecoes[projecao_atual]
  projecao_atual = (projecao_atual + 1) % projecoes.length
  objeto.pontos = objeto.pontos.map((ponto) => {
      return f(ponto)
  })
}

function alternarAjuda() {
  if (helpEl.textContent) {
    helpEl.textContent = "";
    return;
  }

  helpEl.textContent =
    "Translacao: A/D X, S/W Y, Q/E Z | Rotacao: K/I X, J/L Y, U/O Z | Escala: V/B X, N/M Y, X/C Z";
}

function alternarProjecao() {
  let p = ""
  switch(projecao_atual) {
    case 0: 
      p = "Cavaleira"
      break
    case 1: 
      p = "Obliqua Cavaleira"
      break
    case 2: 
      p = "Paralela Obliqua Cabinet"
      break
    case 3: 
      p = "Ortografica Isometrica"
      break
    case 4: 
      p = "Ponto Fuga Z"
      break
    case 5: 
      p = "Ponto Fuga XZ"
      break
  }
  projecaoEl.textContent =
    `Projecao atual: ${p}`;
}

function parseObjeto3D(conteudo) {
  const linhasTexto = conteudo
    .split(/\r?\n/)
    .map((linha) => linha.replace(/#.*/, "").trim())
    .filter(Boolean);

  if (linhasTexto.length === 0) throw new Error("Arquivo vazio.");

  const [n, m] = linhasTexto[0].split(/\s+/).map(Number);
  if (!Number.isInteger(n) || !Number.isInteger(m) || n <= 0 || m <= 0) {
    throw new Error("A primeira linha deve conter n e m inteiros positivos.");
  }

  if (linhasTexto.length < 1 + n + m) {
    throw new Error(
      "Arquivo incompleto para a quantidade de pontos e linhas informada.",
    );
  }

  const pontos = [];
  for (let i = 0; i < n; i++) {
    const ponto = linhasTexto[1 + i].split(/\s+/).map(Number);
    if (ponto.length !== 3 || ponto.some((valor) => Number.isNaN(valor))) {
      throw new Error(`Ponto invalido na linha ${i + 2}.`);
    }
    pontos.push(ponto);
  }

  let ligacoes = [];
  for (let i = 0; i < m; i++) {
    const linha = linhasTexto[1 + n + i].split(/\s+/).map(Number);
    if (linha.length !== 2 || linha.some((valor) => !Number.isInteger(valor))) {
      throw new Error(`Linha invalida na linha ${i + n + 2}.`);
    }
    ligacoes.push(linha);
  }

  const menorIndice = Math.min(...ligacoes.flat());
  const maiorIndice = Math.max(...ligacoes.flat());
  if (menorIndice === 1 && maiorIndice <= n) {
    ligacoes = ligacoes.map(([a, b]) => [a - 1, b - 1]);
  }

  if (ligacoes.some(([a, b]) => a < 0 || b < 0 || a >= n || b >= n)) {
    throw new Error("As linhas possuem indices fora da faixa de pontos.");
  }

  return criarObjeto3D(pontos, ligacoes);
}

fileInput.addEventListener("change", async (event) => {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  try {
    objeto = parseObjeto3D(await arquivo.text());
    desenharObjeto();
  } catch (erro) {
    alert(`Nao foi possivel carregar o objeto: ${erro.message}`);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "F1") {
    event.preventDefault();
    alternarAjuda();
    return;
  }

  if (aplicarComando(event.key.toLowerCase())) {
    event.preventDefault();
  }
});

desenharObjeto();
