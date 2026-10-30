// ===== 1. DADOS: troque aqui pelos seus valores =====
const DATA = {
  perfil: "Gerente",   // ou "Vendedor"
  visao: {totalOS:30, rendimento:7890.25, novas:10, andamento:10, canceladas:10},
  dias: ["SEG","TER","QUA","QUI","SEX","SAB","DOM"],
  meses: [
    {nome:"Mês 10", cor:"#e85d5d", v:[150,50,50,140,230,320,200]},
    {nome:"Mês 09", cor:"#4fc3f7", v:[50,180,310,170,50,190,110]},
    {nome:"Mês 08", cor:"#f5c542", v:[50,180,50,50,270,310,240]}
  ],
  orcamentos: {novos:10, negados:10, aprovados:10},
  pedidos: [
    {nome:"Geladeiras", v:12, cor:"#f2e6c0"},
    {nome:"Computadores", v:10, cor:"#4fc3f7"},
    {nome:"Fornos", v:8, cor:"#7a7a84"},
    {nome:"Celulares", v:6, cor:"#e866c8"},
    {nome:"Cadeiras hidráulicas", v:4, cor:"#3d63f2"}
  ]
};

// ===== 2. TEXTOS E NÚMEROS DA PÁGINA =====
const $ = id => document.getElementById(id);
const moeda = v => new Intl.NumberFormat("pt-BR", {style:"currency", currency:"BRL"}).format(v);
$("perfil").textContent = DATA.perfil;
$("kTotal").textContent = DATA.visao.totalOS;
$("kRend").textContent = moeda(DATA.visao.rendimento);
$("kNovas").textContent = DATA.visao.novas;
$("kAnd").textContent = DATA.visao.andamento;
$("kCanc").textContent = DATA.visao.canceladas;
$("n1").textContent = DATA.orcamentos.novos;
$("n2").textContent = DATA.orcamentos.negados;
$("n3").textContent = DATA.orcamentos.aprovados;

// ===== 3. CONFIGURAÇÃO GERAL DOS GRÁFICOS (tema escuro) =====
Chart.defaults.font.family = '"Poppins", system-ui, sans-serif';
Chart.defaults.color = "#a0a0a6";
const grid = "#2c2c30";

// ===== 4. GRÁFICO DE LINHAS (VENDAS) =====
const line = new Chart($("line"), {
  type: "line",
  data: {
    labels: DATA.dias,
    datasets: DATA.meses.map(m => ({label:m.nome, data:m.v, borderColor:m.cor, backgroundColor:m.cor,
      borderWidth:2, tension:0, pointRadius:0, pointHoverRadius:5}))
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    interaction:{mode:"index", intersect:false},      // hover mostra todos os meses do dia
    plugins:{legend:{display:false}, tooltip:{padding:10}},
    scales:{
      x:{grid:{display:false}, ticks:{font:{weight:"600"}}},
      y:{beginAtZero:true, grid:{color:grid}, border:{display:false}}
    }
  }
});

// Botões que ligam/desligam cada mês
DATA.meses.forEach((m, i) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "chip";
  b.style.setProperty("--c", m.cor);
  b.innerHTML = "<i></i>" + m.nome;
  b.setAttribute("aria-pressed", "true");
  b.onclick = () => {
    const show = !line.isDatasetVisible(i);
    line.setDatasetVisibility(i, show); line.update();
    b.classList.toggle("off", !show); b.setAttribute("aria-pressed", show);
  };
  $("chips").appendChild(b);
});

// ===== 5. PIZZA / ROSCA (PEDIDOS) =====
const pie = new Chart($("pie"), {
  type: "doughnut",
  data: {labels:DATA.pedidos.map(p => p.nome),
    datasets:[{data:DATA.pedidos.map(p => p.v), backgroundColor:DATA.pedidos.map(p => p.cor),
      borderWidth:0, hoverOffset:6}]},
  options: {responsive:true, maintainAspectRatio:false, cutout:0, plugins:{legend:{display:false}}}
});

// Legenda clicável: esconde/mostra a fatia
DATA.pedidos.forEach((p, i) => {
  const r = document.createElement("button");
  r.type = "button"; r.className = "row";
  r.style.setProperty("--c", p.cor);
  r.innerHTML = "<i></i><span>" + p.nome + "</span><em>" + p.v + "</em>";
  r.onclick = () => {
    pie.toggleDataVisibility(i); pie.update();
    r.classList.toggle("off", !pie.getDataVisibility(i));
  };
  $("legend").appendChild(r);
});