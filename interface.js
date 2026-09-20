var grafo = criarGrafo();
var resultado = null;
var proximoClique = "origem";
var origemSelecionada = "A";
var destinoSelecionado = "U";

var campoOrigem = document.getElementById("origem");
var campoDestino = document.getElementById("destino");
var campoHeuristica = document.getElementById("heuristica");
var textoStatus = document.getElementById("status");
var textoHeuristica = document.getElementById("heuristica-usada");
var textoCusto = document.getElementById("custo");
var textoExpandidos = document.getElementById("expandidos");
var textoTrajeto = document.getElementById("trajeto");
var botaoBuscar = document.getElementById("buscar");
var botaoLimpar = document.getElementById("limpar");

function preencherCampos() {
  var nomes = Object.keys(pontos);
  var i;
  for (i = 0; i < nomes.length; i++) {
    var opcaoOrigem = document.createElement("option");
    var opcaoDestino = document.createElement("option");
    opcaoOrigem.value = nomes[i];
    opcaoOrigem.textContent = nomes[i];
    opcaoDestino.value = nomes[i];
    opcaoDestino.textContent = nomes[i];
    campoOrigem.appendChild(opcaoOrigem);
    campoDestino.appendChild(opcaoDestino);
  }
  campoOrigem.value = origemSelecionada;
  campoDestino.value = destinoSelecionado;
}

function nomeDaHeuristica() {
  if (campoHeuristica.value === "euclidiana") return "Euclidiana";
  if (campoHeuristica.value === "chebyshev") return "Chebyshev";
  return "Manhattan";
}

function textoDaRota() {
  var texto = "";
  for (var i = 0; i < resultado.rota.length; i++) {
    var nome = resultado.rota[i];
    if (i > 0) texto += " → ";
    texto += nome + "(" + resultado.custos[nome] + ")";
  }
  return texto;
}

function mostrarResultado() {
  textoHeuristica.textContent = nomeDaHeuristica();

  if (resultado === null) {
    textoStatus.textContent = "Rota indisponível";
    textoCusto.textContent = "—";
    textoExpandidos.textContent = "—";
    textoTrajeto.textContent = "Não existe caminho entre os pontos selecionados.";
    return;
  }

  textoStatus.textContent = "Rota de " + origemSelecionada + " para " + destinoSelecionado;
  textoCusto.textContent = resultado.custos[destinoSelecionado] + " U";
  textoExpandidos.textContent = resultado.expandidos;
  textoTrajeto.textContent = textoDaRota();
}

function buscarRota() {
  origemSelecionada = campoOrigem.value;
  destinoSelecionado = campoDestino.value;

  if (origemSelecionada === destinoSelecionado) {
    resultado = {
      rota: [origemSelecionada],
      custos: {},
      testadas: [],
      expandidos: 1
    };
    resultado.custos[origemSelecionada] = 0;
  } else {
    resultado = calcularAEstrela(grafo, origemSelecionada, destinoSelecionado, campoHeuristica.value);
  }

  mostrarResultado();
  desenharMapa();
}

function limparBusca() {
  resultado = null;
  proximoClique = "origem";
  origemSelecionada = "A";
  destinoSelecionado = "U";
  campoOrigem.value = origemSelecionada;
  campoDestino.value = destinoSelecionado;
  textoStatus.textContent = "Aguardando seleção";
  textoHeuristica.textContent = "—";
  textoCusto.textContent = "—";
  textoExpandidos.textContent = "—";
  textoTrajeto.textContent = "Selecione uma origem e um destino.";
  desenharMapa();
}

function escolherPontoNoMapa(evento) {
  var retangulo = canvas.getBoundingClientRect();
  var x = (evento.clientX - retangulo.left) * canvas.width / retangulo.width;
  var y = (evento.clientY - retangulo.top) * canvas.height / retangulo.height;
  var nomes = Object.keys(pontos);
  var pontoEscolhido = null;

  for (var i = 0; i < nomes.length; i++) {
    var posicao = posicaoNoCanvas(nomes[i]);
    var distancia = Math.sqrt((x - posicao.x) * (x - posicao.x) + (y - posicao.y) * (y - posicao.y));
    if (distancia <= 24) {
      pontoEscolhido = nomes[i];
      break;
    }
  }

  if (pontoEscolhido === null) return;

  if (proximoClique === "origem") {
    origemSelecionada = pontoEscolhido;
    campoOrigem.value = pontoEscolhido;
    proximoClique = "destino";
    resultado = null;
    textoStatus.textContent = "Origem " + pontoEscolhido + " selecionada";
    textoTrajeto.textContent = "Agora clique no ponto de destino.";
    desenharMapa();
  } else {
    destinoSelecionado = pontoEscolhido;
    campoDestino.value = pontoEscolhido;
    proximoClique = "origem";
    buscarRota();
  }
}

preencherCampos();
canvas.addEventListener("click", escolherPontoNoMapa);
botaoBuscar.addEventListener("click", buscarRota);
botaoLimpar.addEventListener("click", limparBusca);
desenharMapa();
