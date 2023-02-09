window.onload = (event) => {
  uploadTable();
};

const uploadTable = async (req, res) => {
  try {
    // saldo inicial

    const saldoIni = [{ yearMonth: "2023-1", saldoTotal: 0 }];
    const saldo = saldoIni.reduce(
      (a, { yearMonth, saldoTotal }) => (
        (a[yearMonth] = (a[yearMonth] || 0) + +saldoTotal), a
      ),
      {}
    );
    saldo.name = "8 Otros";
    console.log(saldo);

    // Ventas
    const ventas = await fetch("/api/reports/openingBalance").then((response) =>
      response.json()
    );
    const venta = ventas.reduce(
      (a, { yearMonth, precioTotal }) => (
        (a[yearMonth] = (a[yearMonth] || 0) + +precioTotal), a
      ),
      {}
    );
    venta.name = "1 Ventas";

    // Bonificaciones

    const bonif = await fetch("/api/reports/discountMonth").then((response) =>
      response.json()
    );
    const discount = bonif.reduce(
      (a, { yearMonth, descuentos }) => (
        (a[yearMonth] = (a[yearMonth] || 0) + +descuentos.$numberDecimal * -1),
        a
      ),
      {}
    );
    discount.name = "2 Bonificaciones";

    //Productivos

    const purchases = await fetch("/api/reports/purchases/prod").then(
      (response) => response.json()
    );

    const purchase = purchases.reduce(
      (a, { yearMonth, montoTotal }) => (
        (a[yearMonth] =
          (a[yearMonth] || 0) + +montoTotal.$numberDecimal * -1 || 0),
        a
      ),
      {}
    );
    purchase.name = "3 Gastos Productivos";

    // no productivos
    const purchasesNoProd = await fetch("/api/reports/purchases/noProd").then(
      (response) => response.json()
    );
    const purchaseNoProd = purchasesNoProd.reduce(
      (a, { yearMonth, montoTotal }) => (
        (a[yearMonth] =
          (a[yearMonth] || 0) + +montoTotal.$numberDecimal * -1 || 0),
        a
      ),
      {}
    );
    purchaseNoProd.name = "5 Gastos No Productivos";

    // taxes
    const purchasesTaxes = await fetch("/api/reports/purchases/taxes").then(
      (response) => response.json()
    );
    const purchaseTaxes = purchasesTaxes.reduce(
      (a, { yearMonth, montoTotal }) => (
        (a[yearMonth] =
          (a[yearMonth] || 0) + +montoTotal.$numberDecimal * -1 || 0),
        a
      ),
      {}
    );
    purchaseTaxes.name = "7 Impuestos";

    //CREAR TABLA
    const resultados = [
      saldo,
      venta,
      discount,
      purchase,
      purchaseNoProd,
      purchaseTaxes,
    ];

    const table = () => {
      $("#tablaReports").DataTable().clear().destroy();
      $("#tablaReports").DataTable({
        info: false,
        responsive: false,
        width: 800,
        searching: false,
        paginate: false,
        data: resultados,
        columns: [
          {
            data: "name",
          },
          {
            data: "2023-1",
            defaultContent: "0",
          },
          {
            data: "2023-2",
            defaultContent: "0",
          },
          {
            data: "2023-3",
            defaultContent: "0",
          },
          {
            data: "2023-4",
            defaultContent: "0",
          },
          {
            data: "2023-5",
            defaultContent: "0",
          },
          {
            data: "2023-6",
            defaultContent: "0",
          },
          {
            data: "2023-7",
            defaultContent: "0",
          },
          {
            data: "2023-8",
            defaultContent: "0",
          },
          {
            data: "2023-9",
            defaultContent: "0",
          },
          {
            data: "2023-10",
            defaultContent: "0",
          },
          {
            data: "2023-11",
            defaultContent: "0",
          },
          {
            data: "2023-12",
            defaultContent: "0",
          },
        ],
        footerCallback: function (row, data, start, end, display) {
          var api = this.api(),
            data;
          var intVal = function (i) {
            return typeof i === "string"
              ? i.replace(/[\$,]/g, ".") * 1
              : typeof i === "number"
              ? i
              : 0;
          };

          const total1 = api
            .column(1)
            .data()
            .reduce(function (a, b) {
              return intVal(a) + intVal(b);
            }, 0);
          jQuery(api.column(1).footer()).html(
            "$" + parseFloat(total1).toLocaleString("es-ar")
          );
          jQuery(api.column(1).header()).html(0);
          jQuery(api.column(2).header()).html(
            "$" + parseFloat(total1).toLocaleString("es-ar")
          );
          saldo["2023-2"] = total1;
          ///
          for (let i = 2; i < 12; i++) {
            var total = api
              .column(i)
              .data()
              .reduce(function (a, b) {
                return intVal(a) + intVal(b);
              }, 0);
            saldo["2023-" + (i + 1)] = total;
            jQuery(api.column(i).footer()).html(
              "$" + parseFloat(total).toLocaleString("es-ar")
            );
            jQuery(api.column(i + 1).header()).html(
              "$" + parseFloat(total).toLocaleString("es-ar")
            );
          }
        },
      });
    };

    table();

    const titulo = document.getElementById("theadMes");
    const sIni = document.getElementsByTagName("thead");

    const tituloClone = titulo.cloneNode(true);
    const sIniClone = sIni[0].cloneNode(true);

    sIni[0].replaceWith(tituloClone);
    titulo.replaceWith(sIniClone);
  } catch (error) {
    return res.status(404).json(error);
  }
};
// Chart cemetno MESES

const cementoMeses = async () => {
  const ctx = document.getElementById("cementosGraph");
  const data = await fetch("/api/resultados/cementoMeses").then((response) =>
    response.json()
  );

  const myChart = new Chart(ctx, {
    type: "horizontalBar",
    data: {
      labels: data[1].reverse().map((e) =>
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
