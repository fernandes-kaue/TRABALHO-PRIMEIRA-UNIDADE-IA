function calcularHeuristica(pontoAtual, destino, tipo) {
  var dx = Math.abs(pontos[pontoAtual][0] - pontos[destino][0]);
  var dy = Math.abs(pontos[pontoAtual][1] - pontos[destino][1]);

  if (tipo === "euclidiana") {
    return Math.sqrt(dx * dx + dy * dy);
  }
  if (tipo === "chebyshev") {
    return Math.max(dx, dy);
  }
  return dx + dy;
}

function ordenarPorF(lista) {
  lista.sort(function (a, b) {
    if (a.f === b.f) {
      if (a.nome < b.nome) return -1;
      if (a.nome > b.nome) return 1;
      return 0;
    }
    return a.f - b.f;
  });
}

function montarRota(anterior, destino) {
  var rota = [];
  var ponto = destino;

  while (ponto !== undefined) {
    rota.unshift(ponto);
    ponto = anterior[ponto];
  }
  return rota;
}

function calcularAEstrela(grafo, origem, destino, tipoHeuristica) {
  var abertos = [{ nome: origem, f: 0 }];
  var custos = {};
  var anterior = {};
  var fechados = [];
  var testadas = [];
  custos[origem] = 0;

  while (abertos.length > 0) {
    ordenarPorF(abertos);
    var atual = abertos.shift();

    if (fechados.indexOf(atual.nome) !== -1) {
      continue;
    }
    fechados.push(atual.nome);

    if (atual.nome === destino) {
      break;
    }

    var vizinhos = grafo[atual.nome];
    for (var i = 0; i < vizinhos.length; i++) {
      var vizinho = vizinhos[i];
      var identificador = atual.nome + "-" + vizinho.nome;
      var novoCusto = custos[atual.nome] + vizinho.distancia;

      if (testadas.indexOf(identificador) === -1) {
        testadas.push(identificador);
      }

      if (custos[vizinho.nome] === undefined || novoCusto < custos[vizinho.nome]) {
        custos[vizinho.nome] = novoCusto;
        anterior[vizinho.nome] = atual.nome;
        abertos.push({
          nome: vizinho.nome,
          f: novoCusto + calcularHeuristica(vizinho.nome, destino, tipoHeuristica)
        });
      }
    }
  }

  if (custos[destino] === undefined) {
    return null;
  }

  return {
    rota: montarRota(anterior, destino),
    custos: custos,
    testadas: testadas,
    expandidos: fechados.length
  };
}
