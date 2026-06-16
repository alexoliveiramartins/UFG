// da ultima atividade eu organizei o codigo
// comentando algumas partes e ordenando
// de forma mais organizada as funcoes,
// alem de mudar o programa para usar matrizes
// de rotacao, em vez de multiplicar os campos
// do jeito que estava antes, como o professor
// sugeriu

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");
const helpEl = document.getElementById("help");
const projecaoEl = document.getElementById("projecao");
// ctx.translate(0, canvas.height);
// ctx.scale(1, -1);

const TRANSLATE_STEP = 10;
const ROTATE_STEP = 5;
const SCALE_STEP = 0.1;
const CAVALIER_ANGLE = Math.PI / 4;
const CAVALIER_FACTOR = 0.5;

let objetos = [criarCubo()]
let objetoAtual = 0
let numeroObjetos = 1

// ====== matrizes de transformacao/projecao/perspectiva

const escala = (sX, sY, sZ) => {
  return [
    [sX, 0, 0, 0],
    [0, sY, 0, 0],
    [0, 0, sZ, 0],
    [0, 0, 0, 1],
  ];
};

const translacao = (tX, tY, tZ) => {
  return [
    [1, 0, 0, tX],
    [0, 1, 0, tY],
    [0, 0, 1, tZ],
    [0, 0, 0, 1],
  ];
};

const rotacaoZ = (rZ) => {
  const cos = Math.cos(grausParaRad(rZ));
  const sin = Math.sin(grausParaRad(rZ));
  return [
    [cos, -sin, 0, 0],
    [sin, cos, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
};

const rotacaoX = (rX) => {
  const cos = Math.cos(grausParaRad(rX));
  const sin = Math.sin(grausParaRad(rX));
  return [
    [1, 0, 0, 0],
    [0, cos, -sin, 0],
    [0, sin, cos, 0],
    [0, 0, 0, 1],
  ];
};

const rotacaoY = (rY) => {
  const cos = Math.cos(grausParaRad(rY));
  const sin = Math.sin(grausParaRad(rY));
  return [
    [cos, 0, sin, 0],
    [0, 1, 0, 0],
    [-sin, 0, cos, 0],
    [0, 0, 0, 1],
  ];
};

const obliquaCavaleira = (x, y, z) => {
  const theta = grausParaRad(45);
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return [
    [1, 0, cos, 0],
    [0, 1, sin, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
  ];
};

const paralelaObliquaCabinet = (x, y, z) => {
  const theta = grausParaRad(45);
  const cos = 0.5 * Math.cos(theta);
  const sin = 0.5 * Math.sin(theta);
  return [
    [1, 0, cos, 0],
    [0, 1, sin, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
  ];
};

const ortograficaIsometrica = (x, y, z) => {
  const umRaizDois = 1 / Math.sqrt(2);
  const umRaizSeis = 1 / Math.sqrt(6);
  const doisRaizSeis = 2 / Math.sqrt(6);
  return [
    [umRaizDois, 0, -umRaizDois, 0],
    [umRaizSeis, doisRaizSeis, umRaizSeis, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
  ];
};

const pontoFugaZ = (x, y, z) => {
  const d = 500;
  return [
    [d, 0, 0, 0],
    [0, d, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1, d],
  ];
};

const pontoFugaXZ = (x, y, z) => {
  const dx = 500;
  const dz = 500;
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [1 / dx, 0, 1 / dz, 1],
  ];
};

let projecao_atual = 0;
const projecoes = [
  obliquaCavaleira,
  paralelaObliquaCabinet,
  ortograficaIsometrica,
  pontoFugaZ,
  pontoFugaXZ,
];

// ====== funcoes de desenho na tela ======

function aplicarTransformacoes([x, y, z], obj) {
  let pontoHomogeneo = [[x], [y], [z], [1]];

  // escala
  pontoHomogeneo = multiplicarMatrizes(
    escala(obj.Sx, obj.Sy, obj.Sz),
    pontoHomogeneo,
  );

  // translacao
  pontoHomogeneo = multiplicarMatrizes(
    translacao(obj.Tx, obj.Ty, obj.Tz),
    pontoHomogeneo,
  );

  // rotacao
  pontoHomogeneo = multiplicarMatrizes(rotacaoX(obj.Rx), pontoHomogeneo);
  pontoHomogeneo = multiplicarMatrizes(rotacaoY(obj.Ry), pontoHomogeneo);
  pontoHomogeneo = multiplicarMatrizes(rotacaoZ(obj.Rz), pontoHomogeneo);

  return [
    pontoHomogeneo[0][0], // x
    pontoHomogeneo[1][0], // y
    pontoHomogeneo[2][0], // z
  ];
}

function aplicarProjecao([x, y, z], obj) {
  let pontoHomogeneo = [[x], [y], [z], [1]];

  pontoHomogeneo = multiplicarMatrizes(
    projecoes[projecao_atual](x, y, z),
    pontoHomogeneo,
  );

  const w = pontoHomogeneo[3][0];
  return {
    x: pontoHomogeneo[0][0] / w, // x
    y: pontoHomogeneo[1][0] / w, // y
  };
}

function desenharTodos(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objetos.map((obj) => desenharObjeto(obj))
}

function desenharObjeto(objeto) {
  const transformados = objeto.pontos.map((p) =>
    aplicarTransformacoes(p, objeto),
  );
  const projetados = transformados.map((p) => aplicarProjecao(p, objeto));
  const escala = 1;
  const pontosTela = projetados.map((p) => paraTela(p, escala));

  ctx.fillStyle = "black";
  for (const [a, b] of objeto.linhas) {
    const p1 = pontosTela[a-1];
    const p2 = pontosTela[b-1];
    linhaDDA(p1.x, p1.y, p2.x, p2.y);
  }
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

// ===== helpers/utils =====

function grausParaRad(graus) {
  return (graus * Math.PI) / 180;
}

function mudarEscala(eixo, delta) {
  const campo = `S${eixo}`;
  objeto[campo] = Math.max(0.1, Number((objeto[campo] + delta).toFixed(1)));
}

// centraliza o desenho/ponto em relacao a tela
function paraTela(ponto, escala) {
  return {
    x: canvas.width / 2 + ponto.x * escala,
    y: canvas.height / 2 - ponto.y * escala,
  };
}

function multiplicarMatrizes(A, B) {
  const linhasA = A.length;
  const colunasA = A[0].length;
  const colunasB = B[0].length;

  const resultado = [];

  for (let i = 0; i < linhasA; i++) {
    resultado[i] = [];

    for (let j = 0; j < colunasB; j++) {
      let soma = 0;

      for (let k = 0; k < colunasA; k++) {
        soma += A[i][k] * B[k][j];
      }

      resultado[i][j] = soma;
    }
  }

  return resultado;
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

function parseObjectsFile(conteudo) {
  const linhas = conteudo.split(/\n/).map((l) => l.trim())

  if (linhas.length === 0) console.error("Arquivo vazio");

  let objetos = []
  const numObjetos = linhas[2]
  numeroObjetos = numObjetos

  let offset = 3
  for(let i = 0; i < numObjetos; i++){
    offset++ // pula o nome
    pontosObjeto = []
    linhasObjeto = []
    facesObjeto = []

    // 0 = pontos // 1 = linhas // 2 = faces
    quantidades = linhas[offset].split(" ").map(Number) 
    offset++;

    for(let j = offset; j < offset + quantidades[0]; j++){
      pontosObjeto.push(linhas[j].split(" ").map(Number))
    }
    offset += quantidades[0]
    
    for(let j = offset; j < offset + quantidades[1]; j++){
      linhasObjeto.push(linhas[j].split(" ").map(Number))
    }
    offset += quantidades[1]

    for(let j = offset; j < offset + quantidades[2]; j++){
      facesObjeto.push(linhas[j].split(" ").map(Number))
    }
    offset += quantidades[2]

    let transformacoes = []
    for(let j = offset; j < offset + 3; j++){
      transformacoes[j-offset] = linhas[j].split(" ").map(Number)
    }
    offset += 3

    // console.log(pontosObjeto)
    // console.log(linhasObjeto)
    // console.log(facesObjeto)
    // console.log(transformacoes)

    let obj = criarObjeto3D(pontosObjeto, linhasObjeto, facesObjeto)
    obj.Rx = transformacoes[0][0]
    obj.Ry = transformacoes[0][1]
    obj.Rz = transformacoes[0][2]
    
    obj.Sx *= transformacoes[1][0]
    obj.Sy *= transformacoes[1][1]
    obj.Sz *= transformacoes[1][2]

    obj.Tx = transformacoes[2][0]
    obj.Ty = transformacoes[2][1]
    obj.Tz = transformacoes[2][2]

    objetos.push(obj)
  }
  return objetos
}

function criarObjeto3D(
  pontos, linhas, faces
) {
  return {
    n: pontos.length,
    m: linhas.length,
    pontos,
    linhas,
    faces,
    Tx: 0, // translacao x, y, z
    Ty: 0,
    Tz: 0,
    Rx: 0, // rotacao x, y, z
    Ry: 0,
    Rz: 0,
    Sx: 1, // size(tamanho) x, y, z
    Sy: 1,
    Sz: 1,
  };
}

function criarCubo() {
  const s = 80;
  return criarObjeto3D(
    [
      // ponto
      [-s, -s, -s],
      [s, -s, -s],
      [s, s, -s],
      [-s, s, -s],
      [-s, -s, s],
      [s, -s, s],
      [s, s, s],
      [-s, s, s],
    ],
    [
      // linhas
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 5],
      [1, 5],
      [2, 6],
      [3, 7],
      [4, 8],
    ],
  );
}

// ===== mudancas no html

// keybinds
function aplicarComando(tecla) {
  objeto = objetos[objetoAtual]
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
      projecao_atual = (projecao_atual + 1) % projecoes.length;
      alternarProjecao();
    },
    tab: () => {
      objetoAtual = (objetoAtual + 1) % numeroObjetos;
    }
  };
  comandos[tecla]();
  desenharTodos();
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
  let p = "";
  switch (projecao_atual) {
    case 0:
      p = "Obliqua Cavaleira";
      break;
    case 1:
      p = "Paralela Obliqua Cabinet";
      break;
    case 2:
      p = "Ortografica Isometrica";
      break;
    case 3:
      p = "Ponto Fuga Z";
      break;
    case 4:
      p = "Ponto Fuga XZ";
      break;
  }
  projecaoEl.textContent = `Projecao atual: ${p}`;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "F1") {
    event.preventDefault();
    alternarAjuda();
    return;
  }

  const tecla = event.key.toLowerCase();
  if (tecla === "tab") {
    event.preventDefault();
  }

  aplicarComando(event.key.toLowerCase());
});

fileInput.addEventListener("change", async (event) => {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  try {
    objetos = parseObjectsFile(await arquivo.text());
    console.log("Objetos: ", objetos)
    desenharTodos();
  } catch (erro) {
    alert(`Nao foi possivel carregar o objeto: ${erro.message}`);
  }
});

desenharTodos();
