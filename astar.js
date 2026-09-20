function calcularAEstrela(grafo, origem, destino, tipoHeuristica) {
  const aberto = [{ no: origem, f: 0 }];
  const custo = { [origem]: 0 };
  const anterior = {};
  const fechados = new Set();
  const testadas = new Set();

  while (aberto.length > 0) {
    aberto.sort((a, b) => a.f - b.f);
    const atual = aberto.shift();
    if (fechados.has(atual.no)) continue;
    fechados.add(atual.no);
    if (atual.no === destino) break;

    for (const vizinho of grafo[atual.no].vizinhos) {
      testadas.add(`${atual.no}-${vizinho.no}`);
      const novoCusto = custo[atual.no] + vizinho.distancia;
      if (custo[vizinho.no] === undefined || novoCusto < custo[vizinho.no]) {
        custo[vizinho.no] = novoCusto;
        anterior[vizinho.no] = atual.no;
        aberto.push({
          no: vizinho.no,
          f:
            novoCusto +
            heuristica(grafo[vizinho.no], grafo[destino], tipoHeuristica),
        });
      }
    }
  }
  if (custo[destino] === undefined) return null;

  const rota = [];
  for (let ponto = destino; ponto !== undefined; ponto = anterior[ponto])
    rota.unshift(ponto);
  return { rota, custo, testadas, expandidos: fechados.size };
}

function heuristica(a, b, tipo) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  if (tipo === "euclidiana") return Math.sqrt(dx * dx + dy * dy);
  if (tipo === "chebyshev") return Math.max(dx, dy);
  return dx + dy;
}
