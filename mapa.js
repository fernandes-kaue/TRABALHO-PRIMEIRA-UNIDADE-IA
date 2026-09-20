// Pontos do mapa: [posição horizontal, posição vertical]
var pontos = {
  A: [0, 0], B: [1, 0], C: [4, 0], D: [5, 0], E: [7, 0],
  F: [0, 2], G: [1, 2], H: [4, 2], I: [7, 2],
  J: [1, 3], K: [3, 3], L: [4, 3], M: [5, 3], N: [7, 3],
  O: [4, 4], P: [7, 4], Q: [0, 5], R: [1, 5], S: [3, 5],
  T: [4, 5], U: [7, 5]
};

// Cada item indica uma rua que liga dois pontos.
var ligacoes = [
  ["A", "B"], ["B", "C"], ["C", "D"], ["D", "E"],
  ["A", "F"], ["B", "G"], ["C", "H"], ["D", "M"], ["E", "I"],
  ["F", "G"], ["G", "H"], ["G", "J"], ["H", "L"], ["J", "K"],
  ["K", "L"], ["L", "M"], ["M", "N"], ["F", "Q"], ["G", "R"],
  ["K", "S"], ["L", "T"], ["N", "P"], ["O", "P"], ["O", "T"],
  ["Q", "R"], ["R", "S"], ["S", "T"], ["T", "U"], ["P", "U"]
];

function calcularDistancia(ponto1, ponto2) {
  var x1 = pontos[ponto1][0];
  var y1 = pontos[ponto1][1];
  var x2 = pontos[ponto2][0];
  var y2 = pontos[ponto2][1];
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function criarGrafo() {
  var grafo = {};
  var nomes = Object.keys(pontos);
  var i;

  for (i = 0; i < nomes.length; i++) {
    grafo[nomes[i]] = [];
  }

  for (i = 0; i < ligacoes.length; i++) {
    var ponto1 = ligacoes[i][0];
    var ponto2 = ligacoes[i][1];
    var distancia = calcularDistancia(ponto1, ponto2);

    grafo[ponto1].push({ nome: ponto2, distancia: distancia });
    grafo[ponto2].push({ nome: ponto1, distancia: distancia });
  }
  return grafo;
}
