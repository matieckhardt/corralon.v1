let x = document.querySelectorAll(".moneda");
for (let i = 0, len = x.length; i < len; i++) {
  let num = Number(x[i].innerHTML).toLocaleString("es");
  x[i].innerHTML = num;
  x[i].classList.add("currSign");
}
const saldoIni = () => {
  //Enero
  document.getElementById("salIniene").innerText = 0;
  salIniene = Number(
    parseFloat(document.getElementById("salIniene").innerText).toFixed(2)
  );
  totVarene = salIniene + ventasene - boniene - gasProene;
  totalene = totVarene - gasNoProene;
  document.getElementById("totalene").innerText = totalene;

  //febero
  document.getElementById("salInifeb").innerText = totalene;
  salInifeb = Number(
    parseFloat(document.getElementById("salInifeb").innerText).toFixed(2)
  );
  totVarfeb = salInifeb + ventasfeb - bonifeb - gasProfeb;
  totalfeb = totVarfeb - gasNoProfeb;
  document.getElementById("totalfeb").innerText = totalfeb;

  //marzo
  document.getElementById("salInimar").innerText = totalfeb;
  salInimar = Number(
    parseFloat(document.getElementById("salInimar").innerText).toFixed(2)
  );
  totVarmar = salInimar + ventasmar - bonimar - gasPromar;
  totalmar = totVarmar - gasNoPromar;
  document.getElementById("totalmar").innerText = totalmar;

  //Abril
  document.getElementById("salIniabr").innerText = totalmar;
  salIniabr = Number(
    parseFloat(document.getElementById("salIniabr").innerText).toFixed(2)
  );
  totVarabr = salIniabr + ventasabr - boniabr - gasProabr;
  totalabr = totVarabr - gasNoProabr;
  document.getElementById("totalabr").innerText = totalabr;

  //mayo
  document.getElementById("salInimay").innerText = totalabr;
  salInimay = Number(
    parseFloat(document.getElementById("salInimay").innerText).toFixed(2)
  );
  totVarmay = salInimay + ventasmay - bonimay - gasPromay;
  totalmay = totVarmay - gasNoPromay;
  document.getElementById("totalmay").innerText = totalmay;

  //junio
  document.getElementById("salInijun").innerText = totalmay;
  salInijun = Number(
    parseFloat(document.getElementById("salInijun").innerText).toFixed(2)
  );
  totVarjun = salInijun + ventasjun - bonijun - gasProjun;
  totaljun = totVarjun - gasNoProjun;
  document.getElementById("totaljun").innerText = totaljun;

  //julio
  document.getElementById("salInijul").innerText = totaljun;
  salInijul = Number(
    parseFloat(document.getElementById("salInijul").innerText).toFixed(2)
  );
  totVarjul = salInijul + ventasjul - bonijul - gasProjul;
  totaljul = totVarjul - gasNoProjul;
  document.getElementById("totaljul").innerText = totaljul;

  //Agosto
  document.getElementById("salIniAgo").innerText = totaljul;
  salIniago = Number(
    parseFloat(document.getElementById("salIniago").innerText).toFixed(2)
  );
  totVarago = salIniago + ventasago - boniago - gasProago;
  totalago = totVarago - gasNoProago;
  document.getElementById("totalAgo").innerText = totalago;

  //septiembre
  document.getElementById("salInisep").innerText = totalago;
  salInisep = Number(
    parseFloat(document.getElementById("salInisep").innerText).toFixed(2)
  );
  totVarsep = salInisep + ventassep - bonisep - gasProsep;
  totalsep = totVarsep - gasNoProsep;
  document.getElementById("totalsep").innerText = totalsep;

  //octubre
  document.getElementById("salInioct").innerText = totalsep;
  salInioct = Number(
    parseFloat(document.getElementById("salInioct").innerText).toFixed(2)
  );
  totVaroct = salInioct + ventasoct - bonioct - gasProoct;
  totaloct = totVaroct - gasNoProoct;
  document.getElementById("totaloct").innerText = totaloct;
  /*
  //noviembre
  document.getElementById("salIninov").innerText = totaloct;
  salIninov = Number(
    parseFloat(document.getElementById("salIninov").innerText).toFixed(2)
  );
  totVarnov = salIninov + ventasnov - boninov - gasPronov;
  totalnov = totVarnov - gasNoPronov;
  document.getElementById("totalnov").innerText = totalnov;

  //diciembre
  document.getElementById("salInidec").innerText = totalnov;
  salInidec = Number(
    parseFloat(document.getElementById("salInidec").innerText).toFixed(2)
  );
  totVardec = salInidec + ventasdec - bonidec - gasProdec;
  totaldec = totVardec - gasNoProdec;
  document.getElementById("totaldec").innerText = totaldec;
  */
};

// Chart cemetno MESES

const cementoMeses = async () => {
  const ctx = document.getElementById("cementosGraph");
  const data = await fetch("/api/resultados/cementoMeses").then((response) =>
    response.json()
  );
  console.log(
    data[1]
      .reverse()
      .map((e) =>
        e.toLocaleString("es-ar", { year: "numeric", month: "short" })
      )
  );
  const myChart = new Chart(ctx, {
    type: "horizontalBar",
    data: {
      labels: data[1].map((e) =>
        new Date(e).toLocaleString("es-ar", {
          month: "short",
          year: "numeric",
        })
      ),

      datasets: [
        {
          label: "Unidades de Cementos Vendidos",
          data: data[0].reverse(),
          backgroundColor: "#FFDB83",
          borderColor: "#FFDB83",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
cementoMeses();

// Chart ventas MESES

const ventasMeses = async () => {
  const ctx = document.getElementById("ventasGraph");
  const data = await fetch("/api/resultados/ventaMeses").then((response) =>
    response.json()
  );
  console.log(data[0]);
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data[1].map((e) =>
        new Date(e).toLocaleString("es-ar", {
          month: "short",
          year: "numeric",
        })
      ),

      datasets: [
        {
          label: "Reporte de Ventas x Mes",
          data: data[0],
          backgroundColor: "#eaf1f5",
          borderColor: "#97bbcd",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              suggestedMax: 35000000,
              suggestedMin: 0,
              fontSize: 12,
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return "$" + value;
              },
            },
          },
        ],
      },
    },
  });
};
ventasMeses();
