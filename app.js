const POSICOES = {
  A: [0, 0],
  B: [1, 0],
  C: [4, 0],
  D: [5, 0],
  E: [7, 0],
  F: [0, 2],
  G: [1, 2],
  H: [4, 2],
  I: [7, 2],
  J: [1, 3],
  K: [3, 3],
  L: [4, 3],
  M: [5, 3],
  N: [7, 3],
  O: [4, 4],
  P: [7, 4],
  Q: [0, 5],
  R: [1, 5],
  S: [3, 5],
  T: [4, 5],
  U: [7, 5],
};

const LIGACOES = [
  ["A", "B"],
  ["B", "C"],
  ["C", "D"],
  ["D", "E"],
  ["A", "F"],
  ["B", "G"],
  ["C", "H"],
  ["D", "M"],
  ["E", "I"],
  ["F", "G"],
  ["G", "H"],
  ["G", "J"],
  ["H", "L"],
  ["J", "K"],
  ["K", "L"],
  ["L", "M"],
  ["M", "N"],
  ["F", "Q"],
  ["G", "R"],
  ["K", "S"],
  ["L", "T"],
  ["N", "P"],
  ["O", "P"],
  ["O", "T"],
  ["Q", "R"],
  ["R", "S"],
  ["S", "T"],
  ["T", "U"],
  ["P", "U"],
];

const grafo = criarGrafo();
const canvas = document.querySelector("#mapa");
const ctx = canvas.getContext("2d");
const origemSelect = document.querySelector("#origem");
const destinoSelect = document.querySelector("#destino");
const heuristicaSelect = document.querySelector("#heuristica");
let resultado = null;
let proximoClique = "origem";

function criarGrafo() {
  const mapa = {};
  for (const [nome, [x, y]] of Object.entries(POSICOES))
    mapa[nome] = { x, y, vizinhos: [] };
  for (const [a, b] of LIGACOES) {
    const distancia = distanciaEntre(a, b);
    mapa[a].vizinhos.push({ no: b, distancia });
    mapa[b].vizinhos.push({ no: a, distancia });
  }
  return mapa;
}

function distanciaEntre(a, b) {
  const [x1, y1] = POSICOES[a];
  const [x2, y2] = POSICOES[b];
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function preencherSeletores() {
  const opcoes = Object.keys(POSICOES)
    .map((nome) => `<option value="${nome}">${nome}</option>`)
    .join("");
  origemSelect.innerHTML = opcoes;
  destinoSelect.innerHTML = opcoes;
  origemSelect.value = "A";
  destinoSelect.value = "U";
}

function coordenada(nome) {
  const [x, y] = POSICOES[nome];
  return { x: 110 + x * 100, y: 75 + y * 88 };
}

function rotaTemAresta(a, b) {
  return (
    resultado &&
    resultado.rota.some(
      (no, i) =>
        i > 0 &&
        ((resultado.rota[i - 1] === a && no === b) ||
          (resultado.rota[i - 1] === b && no === a)),
    )
  );
}

function desenharGrade() {
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  for (let x = 110; x <= 810; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 75);
    ctx.lineTo(x, 515);
    ctx.stroke();
  }
  for (let y = 75; y <= 515; y += 88) {
    ctx.beginPath();
    ctx.moveTo(110, y);
    ctx.lineTo(810, y);
    ctx.stroke();
  }
}

function desenharNo(nome) {
  const p = coordenada(nome);
  const origem = origemSelect.value === nome;
  const destino = destinoSelect.value === nome;
  const naRota = resultado && resultado.rota.includes(nome);
  const cor = origem
    ? "#16a34a"
    : destino
      ? "#dc2626"
      : naRota
        ? "#1677ff"
        : "#ffffff";
  ctx.fillStyle = cor;
  ctx.strokeStyle = naRota || origem || destino ? cor : "#334155";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 19, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = naRota || origem || destino ? "#ffffff" : "#0f172a";
  ctx.font = "bold 16px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(nome, p.x, p.y + 1);
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  desenharGrade();
  for (const [a, b] of LIGACOES) {
    const p1 = coordenada(a);
    const p2 = coordenada(b);
    const foiTestada =
      resultado &&
      (resultado.testadas.has(`${a}-${b}`) ||
        resultado.testadas.has(`${b}-${a}`));
    ctx.strokeStyle = rotaTemAresta(a, b)
      ? "#1677ff"
      : foiTestada
        ? "#f4b400"
        : "#64748b";
    ctx.lineWidth = rotaTemAresta(a, b) ? 7 : foiTestada ? 5 : 3;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
  for (const nome of Object.keys(POSICOES)) desenharNo(nome);
}

function atualizarResultado() {
  const nomes = {
    manhattan: "Manhattan",
    euclidiana: "Euclidiana",
    chebyshev: "Chebyshev",
  };
  document.querySelector("#heuristica-usada").textContent =
    nomes[heuristicaSelect.value];
  if (!resultado) {
    document.querySelector("#status").textContent = "Rota indisponível";
    document.querySelector("#custo").textContent = "—";
    document.querySelector("#expandidos").textContent = "—";
    document.querySelector("#trajeto").textContent =
      "Não existe caminho entre os pontos selecionados.";
    return;
  }
  const destino = destinoSelect.value;
  document.querySelector("#status").textContent =
    `Rota de ${origemSelect.value} para ${destino}`;
  document.querySelector("#custo").textContent =
    `${resultado.custo[destino]} U`;
  document.querySelector("#expandidos").textContent = resultado.expandidos;
  document.querySelector("#trajeto").textContent = resultado.rota
    .map((no) => `${no}(${resultado.custo[no]})`)
    .join(" → ");
}

function buscar() {
  const origem = origemSelect.value;
  const destino = destinoSelect.value;
  resultado =
    origem === destino
      ? {
          rota: [origem],
          custo: { [origem]: 0 },
          testadas: new Set(),
          expandidos: 1,
        }
      : calcularAEstrela(grafo, origem, destino, heuristicaSelect.value);
  atualizarResultado();
  desenhar();
}

canvas.addEventListener("click", (evento) => {
  const rect = canvas.getBoundingClientRect();
  const x = ((evento.clientX - rect.left) * canvas.width) / rect.width;
  const y = ((evento.clientY - rect.top) * canvas.height) / rect.height;
  const selecionado = Object.keys(POSICOES).find((nome) => {
    const p = coordenada(nome);
    return Math.hypot(x - p.x, y - p.y) <= 24;
  });
  if (!selecionado) return;
  if (proximoClique === "origem") {
    origemSelect.value = selecionado;
    proximoClique = "destino";
    resultado = null;
    document.querySelector("#status").textContent =
      `Origem ${selecionado} selecionada`;
    document.querySelector("#trajeto").textContent =
      "Agora clique no ponto de destino.";
    desenhar();
  } else {
    destinoSelect.value = selecionado;
    proximoClique = "origem";
    buscar();
  }
});

document.querySelector("#buscar").addEventListener("click", buscar);
document.querySelector("#limpar").addEventListener("click", () => {
  resultado = null;
  proximoClique = "origem";
  origemSelect.value = "A";
  destinoSelect.value = "U";
  document.querySelector("#status").textContent = "Aguardando seleção";
  document.querySelector("#heuristica-usada").textContent = "—";
  document.querySelector("#custo").textContent = "—";
  document.querySelector("#expandidos").textContent = "—";
  document.querySelector("#trajeto").textContent =
    "Selecione uma origem e um destino.";
  desenhar();
});

preencherSeletores();
desenhar();
