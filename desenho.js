var canvas = document.getElementById("mapa");
var contexto = canvas.getContext("2d");

function posicaoNoCanvas(nome) {
  return {
    x: 110 + pontos[nome][0] * 100,
    y: 75 + pontos[nome][1] * 88
  };
}

function desenharGrade() {
  var x;
  var y;
  contexto.strokeStyle = "#e2e8f0";
  contexto.lineWidth = 1;

  for (x = 110; x <= 810; x += 100) {
    contexto.beginPath();
    contexto.moveTo(x, 75);
    contexto.lineTo(x, 515);
    contexto.stroke();
  }
  for (y = 75; y <= 515; y += 88) {
    contexto.beginPath();
    contexto.moveTo(110, y);
    contexto.lineTo(810, y);
    contexto.stroke();
  }
}

function ruaFoiTestada(ponto1, ponto2) {
  if (resultado === null) return false;
  return resultado.testadas.indexOf(ponto1 + "-" + ponto2) !== -1 ||
    resultado.testadas.indexOf(ponto2 + "-" + ponto1) !== -1;
}

function ruaEstaNaRota(ponto1, ponto2) {
  if (resultado === null) return false;

  for (var i = 1; i < resultado.rota.length; i++) {
    var anterior = resultado.rota[i - 1];
    var atual = resultado.rota[i];
    if ((anterior === ponto1 && atual === ponto2) ||
        (anterior === ponto2 && atual === ponto1)) {
      return true;
    }
  }
  return false;
}

function desenharRua(ponto1, ponto2) {
  var inicio = posicaoNoCanvas(ponto1);
  var fim = posicaoNoCanvas(ponto2);

  if (ruaEstaNaRota(ponto1, ponto2)) {
    contexto.strokeStyle = "#1677ff";
    contexto.lineWidth = 7;
  } else if (ruaFoiTestada(ponto1, ponto2)) {
    contexto.strokeStyle = "#f4b400";
    contexto.lineWidth = 5;
  } else {
    contexto.strokeStyle = "#64748b";
    contexto.lineWidth = 3;
  }

  contexto.beginPath();
  contexto.moveTo(inicio.x, inicio.y);
  contexto.lineTo(fim.x, fim.y);
  contexto.stroke();
}

function corDoNo(nome) {
  if (nome === origemSelecionada) return "#16a34a";
  if (nome === destinoSelecionado) return "#dc2626";
  if (resultado !== null && resultado.rota.indexOf(nome) !== -1) return "#1677ff";
  return "#ffffff";
}

function desenharNo(nome) {
  var posicao = posicaoNoCanvas(nome);
  var cor = corDoNo(nome);
  var temCor = cor !== "#ffffff";

  contexto.fillStyle = cor;
  contexto.strokeStyle = temCor ? cor : "#334155";
  contexto.lineWidth = 3;
  contexto.beginPath();
  contexto.arc(posicao.x, posicao.y, 19, 0, Math.PI * 2);
  contexto.fill();
  contexto.stroke();

  contexto.fillStyle = temCor ? "#ffffff" : "#0f172a";
  contexto.font = "bold 16px Arial";
  contexto.textAlign = "center";
  contexto.textBaseline = "middle";
  contexto.fillText(nome, posicao.x, posicao.y + 1);
}

function desenharMapa() {
  var nomes = Object.keys(pontos);
  var i;
  contexto.clearRect(0, 0, canvas.width, canvas.height);
  contexto.fillStyle = "#f8fafc";
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  desenharGrade();

  for (i = 0; i < ligacoes.length; i++) {
    desenharRua(ligacoes[i][0], ligacoes[i][1]);
  }
  for (i = 0; i < nomes.length; i++) {
    desenharNo(nomes[i]);
  }
}
