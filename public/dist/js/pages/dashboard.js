window.onload = () => {
  for (i = 1; i < 10; i++) {
    let ventas = [];
    totalVendido = document.getElementById("card-" + i).innerText;
    ventas = parseFloat(totalVendido).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
    document.getElementById("card-" + i).innerText = ventas;
  }
};

// document.getElementById("foo").addEventListener("change", () => {
//   const elem = document.getElementById("foo");
//   const today = new Date();
//   const datepicker = new Datepicker(elem, {
//     // ...options
//     format: "yyyy/m",
//     minDate: 365,
//     maxView: 365,
//     maxDate: today,
//   });
// });

const changeDate = () => {
  const date = document.getElementById("date").value;
  const split = date.split("-");
  window.location.href = "/api/dashboard/" + split[0] + "/" + split[1];
  console.log("redirected to /api/dashboard/" + split[0] + "/" + split[1]);
};

let today = new Date().toLocaleString("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
console.log(today);

document.getElementById("date").setAttribute("max", today);

// ESTE MES

const year = window.location.href.split("/").slice(5)[0];
const month = window.location.href.split("/").slice(5)[1];
const yearMonth = new Date(year + "/" + month);

let añoMes = yearMonth.toLocaleString("es-ar", {
  year: "numeric",
  month: "long",
});

const setMes =
  (document.getElementById("mes").innerText = añoMes) &&
  (document.getElementById("mes2").innerText = añoMes) &&
  (document.getElementById("yearMonth").innerText = añoMes) &&
  (document.getElementById("mesCompras").innerText = añoMes);

// ESTE Año

let thisYear = year.toLocaleString("es-ar", {
  year: "numeric",
});
const setAño =
  (document.getElementById("esteAño").innerText = thisYear) &&
  (document.getElementById("esteAñoCompras").innerText = thisYear);
