let merchCount = 1;
let sumador = 0;
let descuentoTotal;
let comprobanteCreadoId;
let desc = 1;
const filaVenta = document.getElementById("filaVenta");
const formVentas = document.getElementById("formVentas");
const cliente = document.getElementById("nombreCliente").value;
const clienteId = document.getElementById("clienteId").value;
const clienteCuit = "";
const clienteTel = "";
const clienteDomicilio = "";
const fechaVenta = document.getElementById("fechaVenta");
let hoy = new Date();
let dd = hoy.getDate();
let mm = hoy.getMonth() + 1; //January is 0!
let yyyy = hoy.getFullYear();
if (dd < 10) {
  dd = "0" + dd;
}
if (mm < 10) {
  mm = "0" + mm;
}
hoy = yyyy + "-" + mm + "-" + dd;
fechaVenta.setAttribute("max", hoy);

window.onload = (event) => {
  uploadTable();
  cargarMercaderia();
  manejarPrecios();
  formVentas.addEventListener("submit", async function (e) {
    e.preventDefault();
    await crearPresupuesto();
    altaVentas();
  });
};

async function crearPresupuesto() {
  const today = new Date();
  const validUntil = new Date(new Date().getTime() + 15 * 24 * 3600000);
  let listaDeVentas = [];
  let listaProductos = document.getElementsByName("productoVendido");
  for (producto of listaProductos) {
    listaDeVentas.push({
      cantidad: producto.querySelectorAll("input")[2].value,
      precioFacturado: producto.querySelectorAll("input")[1].value,
      precioLista: producto.querySelectorAll("input")[0].value,
      subtotal: producto.querySelectorAll("input")[3].value,
      mercaderia:
        producto.querySelector("select").options[
          producto.querySelector("select").selectedIndex
        ].innerText,
    });
  }
  const presupuestoData = {
    fechaComp: today.toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    fechaValidez: validUntil.toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    tipoFc: "X",
    clienteNombre: "",
    clienteCuit: "",
    clienteTel: "",
    clienteDomicilio: "",
    clienteCF: "",
    subTotal: sumador,
    descuentos: parseFloat(descuentoTotal).toFixed(2),
    total: document.getElementById("precioTotal").value,
    productos: listaDeVentas,
  };
  const respuesta = await fetch("/api/presupuestos/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(presupuestoData),
  });
  jsonResp = await respuesta.json();
  comprobanteCreadoId = jsonResp.comprobanteId;
  window.open("/api/presupuestos/find/" + jsonResp.comprobanteId, "_blank");
}

const cargarMercaderia = async () => {
  let listaMercaderias = document.getElementsByName("mercaderias");
  const res = await fetch("/api/materiales/list");
  const materiales = await res.json();
  for (select of listaMercaderias) {
    materiales.map((mat) => {
      var opt = document.createElement("option");
      opt.dataset.id = mat._id;
      opt.dataset.stock = mat.stock;
      opt.value = mat.precio;
      opt.innerText = mat.nombre;
      if (parseInt(mat.stock) <= 0) {
        opt.setAttribute("disabled", "disabled");
        opt.style.backgroundColor = "#999";
      }
      select.appendChild(opt);
    });
    select.addEventListener("change", (e) => {
      presentarDatos(e.target);
    });
  }
  fechaVenta.value = hoy;
};

const presentarDatos = (merch) => {
  merch.parentElement.parentElement.nextElementSibling.firstElementChild.children[1].firstElementChild.value =
    merch.value;
  merch.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.children[1].firstElementChild.value =
    merch.value;
  calcularSubtotal();
};

const manejarPrecios = () => {
  let listaPrecioMaterial = document.getElementsByName("precioMaterial");
  let listaCantidad = document.getElementsByName("cantidad");
  for (precio of listaPrecioMaterial) {
    precio.addEventListener("change", (e) => {
      calcularSubtotal(e.target);
    });
  }
  for (cantidad of listaCantidad) {
    cantidad.addEventListener("change", (e) => {
      calcularSubtotal(e.target);
    });
  }
};

const manejarDescuento = (descuento) => {
  desc = (100 - descuento.value) / 100;
  calcularTotal();
};

const calcularSubtotal = () => {
  let listaSubtotales = document.getElementsByName("subtotal");
  for (subtotal of listaSubtotales) {
    let cantidad =
      subtotal.parentElement.parentElement.parentElement.previousElementSibling
        .firstElementChild.lastElementChild.value;
    let precio =
      subtotal.parentElement.parentElement.parentElement.previousElementSibling
        .previousElementSibling.firstElementChild.lastElementChild
        .firstElementChild.value;
    subtotal.value = cantidad * precio;
  }
  calcularTotal();
};

const calcularTotal = () => {
  let precioTotal = document.getElementById("precioTotal");
  let subtotales = document.getElementsByName("subtotal");
  sumador = 0;
  for (subtotal of subtotales) {
    sumador = sumador + parseInt(subtotal.value);
  }
  precioTotal.value = parseFloat(sumador * desc).toFixed(2);
  descuentoTotal = sumador - precioTotal.value;
};

const agregarMercaderia = () => {
  if (merchCount < 31) {
    let clon = filaVenta.firstElementChild.cloneNode(true);
    clon.id = "columnaVenta" + merchCount;
    clon.querySelectorAll("input")[0].value = 0;
    clon.querySelectorAll("input")[1].value = 0;
    clon.querySelectorAll("input")[2].value = 1;
    clon.querySelectorAll("input")[3].value = 0;
    clon.querySelector("select").addEventListener("change", (e) => {
      presentarDatos(e.target);
    });
    filaVenta.appendChild(clon);
    merchCount++;
    document.getElementById("borrarMerch").style.display = "inline-block";
    manejarPrecios();
  }
};

// Handler de vista para borrar mercaderia
const borrarMercaderia = () => {
  if (filaVenta.lastChild != filaVenta.firstElementChild) {
    filaVenta.lastChild.remove();
    merchCount--;
    esconderDelete();
  }
};

// Handler cuando tenes una sola mercaderia
function esconderDelete() {
  if (merchCount == 1) {
    document.getElementById("borrarMerch").style.display = "none";
  }
}

async function altaVentas() {
  let listaDeVentas = [];
  const listaProductos = document.getElementsByName("productoVendido");
  for (venta of listaProductos) {
    listaDeVentas.push({
      precioLista: venta.querySelectorAll("input")[0].value,
      precioFacturado: venta.querySelectorAll("input")[1].value,
      cantidad: venta.querySelectorAll("input")[2].value,
      subtotal: venta.querySelectorAll("input")[3].value,
      mercaderia:
        venta.querySelector("select").options[
          venta.querySelector("select").selectedIndex
        ].text,
    });
  }

  let ventaCliente = {
    cliente,
    clienteId,
    clienteCuit,
    clienteTel,
    clienteDomicilio,
    fecha: fechaVenta.value,
    comprobante: document.getElementById("comprobante").value,
    comprobanteId: comprobanteCreadoId,
    materialesVendidos: listaDeVentas,
    precioTotal: parseFloat(precioTotal.value),
    faltaAcopio: false,
  };
  await fetch("/api/ventas/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ventaCliente),
  })
    .then(() => uploadTable())
    .catch(() => alert("hubo un error en el alta de ventas"));
}

const uploadTable = () => {
  fetch("/api/ventas/find/0")
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      $("#tablaVentas").DataTable().clear().destroy();
      $("#tablaVentas").DataTable({
        pageLength: 25,
        order: [[0, "desc"]],
        data: arrayConObjetos,
        columns: [
          {
            data: "fecha",
          },
          {
            data: "cliente",
          },
          {
            data: "precioTotal",
          },
          {
            data: "comprobante",
          },
          {
            data: "_id",
            data: "cliente",
            data: function (data, type, row) {
              return `<a href="/api/ventas/find/${data._id}" class="btn btn-sm btn-warning" href="#" hidden onclick="mostrarVenta('${data._id}')">Editar <i class="fa fa-edit" ></i></a>
              <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.cliente}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            },
          },
        ],
      });
      formVentas.reset();
      limpiarFilasVentas();
      fechaVenta.value = hoy;
    })
    .catch((err) => {
      console.error(err);
    });
};

function preguntaBorrar(idMaterial, nombre) {
  document.getElementById(
    "modalDel"
  ).innerHTML = `Se está eliminando el cliente: <b>${nombre}</b>`;
  document.getElementById("idBorrar").value = idMaterial;
  $("#modalBorrar").modal("show");
  setTimeout(function () {
    document.getElementById("borrarBtn").removeAttribute("disabled");
    document.getElementById("borrarBtn").innerHTML = "ELIMINAR";
  }, 4000);
}

const eliminarVenta = () => {
  let id = document.getElementById("idBorrar").value;
  fetch(`/api/ventas/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(() => uploadTable())
    .catch((err) => console.log(err));
};

// handler para vaciar los campos de los productos
function limpiarFilasVentas() {
  while (merchCount > 1) {
    borrarMercaderia();
  }
}
