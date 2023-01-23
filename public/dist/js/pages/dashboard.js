window.onload = () => {
  for (i = 1; i < 10; i++) {
    let ventas = [];
    totalVendido = document.getElementById("card-" + i).innerText;
    console.log(totalVendido);
    ventas = parseFloat(totalVendido).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
    console.log(ventas);
    document.getElementById("card-" + i).innerText = ventas;
  }
};

document.getElementById("foo").addEventListener("change", () => {
  const elem = document.getElementById("foo");
  const today = new Date();
  const datepicker = new Datepicker(elem, {
    // ...options
    format: "yyyy/m",
    minDate: 365,
    maxView: 365,
    maxDate: today,
  });
});

const changeDate = () => {
  const date = document.getElementById("foo").value;
  window.location.href = "/api/dashboard/" + date;
  console.log("/api/dashboard/" + date);
};
