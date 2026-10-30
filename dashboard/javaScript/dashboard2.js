// ===== 1. DADOS =====
// Estes são os únicos valores que você precisa trocar para usar seus números.
// (Estimados a partir da imagem enviada.)
const DATA = {
  // Dias da semana no eixo horizontal do gráfico de linhas
  dias: ["SEG","TER","QUA","QUI","SEX","SAB","DOM"],
  // Uma linha por mês: nome, cor e um valor para cada dia (mesma ordem de "dias")
  meses: [
    {nome:"Mês 10", cor:"#e85d5d", v:[150,50,50,140,230,320,200]},
    {nome:"Mês 09", cor:"#4fc3f7", v:[50,180,310,170,50,190,110]},
    {nome:"Mês 08", cor:"#f5b82e", v:[50,180,50,50,270,310,240]}
  ],
  // Os três números do cartão de orçamentos
  orcamentos: {novos:10, negados:10, aprovados:10},
  // Fatias da pizza: nome, quantidade e cor
  pedidos: [
    {nome:"Geladeiras", v:12, cor:"#f2e6c0"},
    {nome:"Computadores", v:10, cor:"#4fc3f7"},
    {nome:"Fornos", v:8, cor:"#444444"},
    {nome:"Celulares", v:6, cor:"#e866c8"},
    {nome:"Cadeiras hidráulicas", v:4, cor:"#3d63f2"}
  ]
};

// ===== 2. ORÇAMENTOS =====
// Escreve os números nos elementos #n1, #n2 e #n3 do HTML
document.getElementById("n1").textContent = DATA.orcamentos.novos;
document.getElementById("n2").textContent = DATA.orcamentos.negados;
document.getElementById("n3").textContent = DATA.orcamentos.aprovados;

// ===== 3. CONFIGURAÇÃO GERAL DOS GRÁFICOS =====
const ink = "#6b7078", grid = "#e3e5e9";             // cor do texto e da grade
Chart.defaults.font.family = 'ui-monospace, Menlo, Consolas, monospace';
Chart.defaults.color = ink;

// ===== 4. GRÁFICO DE LINHAS (VENDAS) =====
const line = new Chart(document.getElementById("line"), {
  type: "line",
  data: {
    labels: DATA.dias,
    // Transforma cada mês de DATA em uma linha do gráfico
    datasets: DATA.meses.map(m => ({
      label: m.nome, data: m.v,
      borderColor: m.cor, backgroundColor: m.cor,
      borderWidth: 2,
      tension: 0,          // 0 = linhas retas; use 0.4 para curvas suaves
      pointRadius: 0,      // sem bolinhas nos pontos...
      pointHoverRadius: 5  // ...exceto ao passar o mouse/dedo
    }))
  },
  options: {
    responsive: true, maintainAspectRatio: false,   // acompanha o tamanho do cartão
    // Ao passar o mouse, mostra os valores de todos os meses naquele dia
    interaction: {mode: "index", intersect: false},
    plugins: {
      legend: {display: false},   // escondemos a legenda padrão: usamos nossos botões
      tooltip: {padding: 10}
    },
    scales: {
      x: {grid: {display: false}, ticks: {font: {weight: "bold"}}},
      y: {beginAtZero: true, grid: {color: grid}, border: {display: false}}
    }
  }
});

// ===== 5. FILTROS DO GRÁFICO DE LINHAS =====
// Cria um botão por mês. Ao clicar, mostra ou esconde aquela linha.
const chips = document.getElementById("chips");
DATA.meses.forEach((m, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "chip";
  b.style.setProperty("--c", m.cor);          // cor da bolinha (usada no CSS)
  b.innerHTML = '<i></i>' + m.nome;
  b.setAttribute("aria-pressed", "true");     // informa leitores de tela que está ligado
  b.onclick = () => {
    const show = !line.isDatasetVisible(i);   // está visível? então esconde (e vice-versa)
    line.setDatasetVisibility(i, show);
    line.update();                            // redesenha o gráfico
    b.classList.toggle("off", !show);         // apaga/risca o botão quando desligado
    b.setAttribute("aria-pressed", show);
  };
  chips.appendChild(b);
});

// ===== 6. GRÁFICO DE PIZZA (PEDIDOS) =====
const pie = new Chart(document.getElementById("pie"), {
  type: "doughnut",    // rosca; com cutout 0 vira pizza
  data: {
    labels: DATA.pedidos.map(p => p.nome),
    datasets: [{
      data: DATA.pedidos.map(p => p.v),
      backgroundColor: DATA.pedidos.map(p => p.cor),
      borderWidth: 0,
      hoverOffset: 6   // a fatia "salta" um pouco ao passar o mouse
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    cutout: 0,                     // 0 = pizza cheia; "55%" = rosca
    plugins: {legend: {display: false}}   // usamos a legenda própria, abaixo
  }
});

// ===== 7. LEGENDA CLICÁVEL DA PIZZA =====
// Cria uma linha (bolinha, nome, valor) para cada categoria.
// Ao clicar, a fatia some do gráfico, e clicando de novo ela volta.
const legend = document.getElementById("legend");
DATA.pedidos.forEach((p, i) => {
  const r = document.createElement("button");
  r.type = "button";
  r.className = "row";
  r.style.setProperty("--c", p.cor);
  r.innerHTML = '<i></i><span>' + p.nome + '</span><em>' + p.v + '</em>';
  r.onclick = () => {
    pie.toggleDataVisibility(i);                         // liga/desliga a fatia
    pie.update();
    r.classList.toggle("off", !pie.getDataVisibility(i)); // apaga/risca a linha
  };
  legend.appendChild(r);
});