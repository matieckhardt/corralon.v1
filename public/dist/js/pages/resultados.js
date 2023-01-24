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
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data[1],

      datasets: [
        {
          label: "Unidades de Cementos Vendidos",
          data: data[0],
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 32, 1)",
            "rgba(54, 162, 35, 1)",
            "rgba(255, 206, 6, 1)",
            "rgba(75, 192, 92, 1)",
            "rgba(153, 102, 55, 1)",
            "rgba(255, 159, 4, 1)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
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
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data[1],

      datasets: [
        {
          label: "Reporte de Ventas x Mes",
          data: data[0],
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 32, 1)",
            "rgba(54, 162, 35, 1)",
            "rgba(255, 206, 6, 1)",
            "rgba(75, 192, 92, 1)",
            "rgba(153, 102, 55, 1)",
            "rgba(255, 159, 4, 1)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
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
ventasMeses();
