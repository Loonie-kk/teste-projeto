 // Dados estimados a partir da imagem. Troque aqui pelos valores da sua planilha.
const DATA = {
  dias: ["SEG","TER","QUA","QUI","SEX","SAB","DOM"],
  meses: [
    {nome:"Mês 10", cor:"#e85d5d", v:[150,50,50,140,230,320,200]},
    {nome:"Mês 09", cor:"#4fc3f7", v:[50,180,310,170,50,190,110]},
    {nome:"Mês 08", cor:"#f5b82e", v:[50,180,50,50,270,310,240]}
  ],
  orcamentos: {novos:10, negados:10, aprovados:10},
  pedidos: [
    {nome:"Geladeiras", v:12, cor:"#f2e6c0"},
    {nome:"Computadores", v:10, cor:"#4fc3f7"},
    {nome:"Fornos", v:8, cor:"#444444"},
    {nome:"Celulares", v:6, cor:"#e866c8"},
    {nome:"Cadeiras hidráulicas", v:4, cor:"#3d63f2"}
  ]
};
document.getElementById("n1").textContent = DATA.orcamentos.novos;
document.getElementById("n2").textContent = DATA.orcamentos.negados;
document.getElementById("n3").textContent = DATA.orcamentos.aprovados;
 
const ink = "#6b7078", grid = "#e3e5e9";
Chart.defaults.font.family = 'ui-monospace, Menlo, Consolas, monospace';
Chart.defaults.color = ink;
 
// Linhas
const line = new Chart(document.getElementById("line"), {
  type: "line",
  data: {
    labels: DATA.dias,
    datasets: DATA.meses.map(m => ({label:m.nome, data:m.v, borderColor:m.cor, backgroundColor:m.cor,
      borderWidth:2, tension:0, pointRadius:0, pointHoverRadius:5}))
  },
  options: {
    responsive:true, maintainAspectRatio:false,
    interaction:{mode:"index", intersect:false},
    plugins:{legend:{display:false}, tooltip:{padding:10}},
    scales:{
      x:{grid:{display:false}, ticks:{font:{weight:"bold"}}},
      y:{beginAtZero:true, grid:{color:grid}, border:{display:false}}
    }
  }
});
const chips = document.getElementById("chips");
DATA.meses.forEach((m,i) => {
  const b = document.createElement("button");
  b.type="button"; b.className="chip"; b.style.setProperty("--c", m.cor);
  b.innerHTML = '<i></i>'+m.nome; b.setAttribute("aria-pressed","true");
  b.onclick = () => {
    const show = !line.isDatasetVisible(i);
    line.setDatasetVisibility(i, show); line.update();
    b.classList.toggle("off", !show); b.setAttribute("aria-pressed", show);
  };
  chips.appendChild(b);
});
 
// Pizza / rosca
const pie = new Chart(document.getElementById("pie"), {
  type: "doughnut",
  data: {labels: DATA.pedidos.map(p=>p.nome), datasets:[{data:DATA.pedidos.map(p=>p.v),
    backgroundColor:DATA.pedidos.map(p=>p.cor), borderWidth:0, hoverOffset:6}]},
  options: {responsive:true, maintainAspectRatio:false, cutout:0, plugins:{legend:{display:false}}}
});
const legend = document.getElementById("legend");
DATA.pedidos.forEach((p,i) => {
  const r = document.createElement("button");
  r.type="button"; r.className="row"; r.style.setProperty("--c", p.cor);
  r.innerHTML = '<i></i><span>'+p.nome+'</span><em>'+p.v+'</em>';
  r.onclick = () => {
    pie.toggleDataVisibility(i); pie.update();
    r.classList.toggle("off", !pie.getDataVisibility(i));
  };
  legend.appendChild(r);
});
const tog = document.getElementById("tog");
tog.onclick = () => {
  const rosca = pie.options.cutout === 0;
  pie.options.cutout = rosca ? "55%" : 0;
  pie.update();
  tog.textContent = rosca ? "Ver como pizza" : "Ver como rosca";
};
