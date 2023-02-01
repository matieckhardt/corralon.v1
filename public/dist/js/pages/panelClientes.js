let merchCount = 1;
let idAcopioDelete = false;
let descuentoTotal;
let desc = 1;
let sumador = 0;
let comprobanteCreadoId;
let pagosRealizados = 0;
let ac = 0;
let aprobarFlag = false;
let remitoId = "";
const filaVenta = document.getElementById("filaVenta");
const formVentas = document.getElementById("formVentas");
const metodo = document.getElementById("metodo");
const ctacte = document.getElementById("ctacte");
const chequeForm = document.getElementById("chequeForm");
const numCheque = document.getElementById("NumCheque");
const FechaCh = document.getElementById("FechaCh");
const comision = document.getElementById("comision");
const porcentaje = document.getElementById("porcentaje");
const porcentajeForm = document.getElementById("porcentajeForm");
const comisionNote = document.getElementById("comisionNote");
const clienteRS = document.getElementById("clienteRS").value;
const clienteCuit = document.getElementById("clienteCuit").value;
const clienteTel = document.getElementById("clienteTel").value;
const clienteObse = document.getElementById("clienteObse").value;
const cliente = document
  .getElementById("nombreCliente")
  .getAttribute("data-id");
const clienteId = document.getElementById("clienteId").value;
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
  formVentas.addEventListener("submit", function (e) {
    e.preventDefault();
    tipoDeVenta();
  });
};

const cuentaCorriente = async () => {
  pagosRealizados = 0;
  fetch("/api/pagos/getPagoCliente/" + clienteId)
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      arrayConObjetos.map(({ monto, metodoDePago }) => {
        if (metodoDePago !== "ctacte") {
          pagosRealizados = (
            parseFloat(pagosRealizados) + parseFloat(monto)
          ).toFixed(2);
        }
      });
    })
    .then(
      () =>
        (ctacte.innerText = (
          parseFloat(pagosRealizados) - parseFloat(ac)
        ).toFixed(2))
    )
    .catch((err) => console.log(err));
};

const evalCheque = (elem) => {
  const recargo = document.getElementById("recargo");
  const recargoContainer = document.getElementById("recargoContainer");
  comision.value = 0;
  calcularSubtotal();
  comision.setAttribute("disabled", "disabled");
  comisionNote.setAttribute("hidden", "hidden");
  recargoContainer.setAttribute("hidden", "hidden");
  recargo.setAttribute("disabled", "disabled");
  elem.value === "cheque"
    ? chequeForm.removeAttribute("hidden")
    : chequeForm.setAttribute("hidden", "hidden");
  elem.value === "cheque"
    ? NumCheque.removeAttribute("disabled")
    : NumCheque.setAttribute("disabled", "disabled");
  elem.value === "cheque"
    ? FechaCh.removeAttribute("disabled")
    : FechaCh.setAttribute("disabled", "disabled");
  if (elem.value === "tarjeta") {
    // comision.removeAttribute("disabled");
    comisionNote.removeAttribute("hidden");
    recargoContainer.removeAttribute("hidden");
    recargo.removeAttribute("disabled");
    recargo.value = "7";
    onChangeRecargo();
    porcentajeForm.removeAttribute("hidden");
  }
  if (elem.value === "debito") {
    // comision.removeAttribute("disabled");
    comisionNote.removeAttribute("hidden");
    recargoContainer.removeAttribute("hidden");
    recargo.removeAttribute("disabled");
    recargo.value = "3";
    onChangeRecargo();
    porcentajeForm.removeAttribute("hidden");
  }
  calcularTotal();
};

const onChangeRecargo = () => {
  const precioTotal = document.getElementById("precioTotal");
  const recargo = document.getElementById("recargo");
  comision.value =
    parseFloat(precioTotal.value) * (parseFloat(recargo.value) / 100);
};

const evalChequeModal = (elem) => {
  elem.value === "cheque"
    ? chequeFormModal.removeAttribute("hidden")
    : chequeFormModal.setAttribute("hidden", "hidden");
  elem.value === "cheque"
    ? numChequeModal.removeAttribute("disabled")
    : numChequeModal.setAttribute("disabled", "disabled");
  elem.value === "cheque"
    ? fechaChequeModal.removeAttribute("disabled")
    : fechaChequeModal.setAttribute("disabled", "disabled");
};

const tipoDeVenta = async () => {
  await crearPresupuesto();
  if (document.getElementById("acopio").checked) {
    altaAcopio();
    altaPago();
  } else {
    altaVentas();
    altaPago();
  }
};

const altaPago = async () => {
  if (document.getElementById("presupuesto").checked) {
    console.log("es presupuesto");
  } else {
    const datosPago = {
      fecha: new Date().toLocaleString([], {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      cliente: document.getElementById("nombreCliente").innerText,
      clienteId,
      comision: comision.value,
      nroComprobante: comprobanteCreadoId,
      metodoDePago: metodo.value,
      observaciones: "",
      monto: parseFloat(precioTotal.value),
    };
    if (metodo.value === "cheque") {
      datosPago["fechaCheque"] = FechaCh.value;
      datosPago["numCheque"] = numCheque.value;
      console.log("es cheque");
    }
    await fetch("/api/pagos/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosPago),
    })
      .then((x) => x.json())
      .then((res) => console.log("pago creado: ", res))
      .catch(() => alert("hubo un error en el alta de Pagos"));
  }
};

const cargarMercaderia = async () => {
  let listaMercaderias = document.getElementsByName("mercaderias");
  const res = await fetch("/api/materiales/list");
  const materiales = await res.json();
  for (select of listaMercaderias) {
    materiales.map((mat) => {
      var opt = document.createElement("option");
      opt.value = mat.precio;
      opt.innerText = mat.nombre;
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

const manejarComprobante = (bool) => {
  const comprobante = document.getElementById("comprobante");
  bool
    ? comprobante.removeAttribute("disabled")
    : comprobante.setAttribute("disabled", "disabled");

  const submitBtn = document.getElementById("btnVenta");
  submitBtn.innerHTML = `<i class="fa fa-plus pr-2"></i>CREAR ${
    bool ? "VENTA" : "PRESUPUESTO"
  }`;
  bool
    ? submitBtn.classList.remove("bg-purple")
    : submitBtn.classList.add("bg-purple");

  // bool
  //   ? metodo.removeAttribute("disabled")
  //   : metodo.setAttribute("disabled", "disabled");
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
    subtotal.value = (cantidad * precio).toFixed(2);
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
  if (metodo.value === "tarjeta") {
    precioTotal.value = (
      parseFloat(precioTotal.value) + parseFloat(comision.value)
    ).toFixed(2);
  } else if (metodo.value === "debito") {
    precioTotal.value = (
      parseFloat(precioTotal.value) + parseFloat(comision.value)
    ).toFixed(2);
  }
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
  calcularSubtotal();
};

// Handler cuando tenes una sola mercaderia
function esconderDelete() {
  if (merchCount == 1) {
    document.getElementById("borrarMerch").style.display = "none";
  }
}

const altaAcopio = async () => {
  const acopioId = await generarAcopio();
  altaVentas(acopioId);
};

async function generarAcopio() {
  let listaAcopio = [];
  let listaProductos = document.getElementsByName("productoVendido");
  for (producto of listaProductos) {
    listaAcopio.push({
      cantidadFaltante: producto.querySelectorAll("input")[2].value,
      mercaderia:
        producto.querySelector("select").options[
          producto.querySelector("select").selectedIndex
        ].text,
    });
  }
  const acopioCliente = {
    cliente: document.getElementById("nombreCliente").innerText,
    clienteId,
    clienteCuit: clienteCuit || "",
    clienteTel: clienteTel || "",
    clienteDomicilio: document.getElementById("clienteDomicilio"),
    materialesAcopio: listaAcopio,
    ventaId: "",
  };
  const res = await fetch("/api/acopio/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(acopioCliente),
  }).catch(() => alert("hubo un error en el alta de ventas"));
  const idCreado = await res.json();
  return idCreado;
}

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
    clienteNombre: document.getElementById("nombreCliente").innerText,
    clienteCuit: clienteCuit || "",
    clienteTel: clienteTel || "",
    clienteDomicilio: document.getElementById("clienteDomicilio").value,
    clienteObse: document.getElementById("clienteObse").value,
    clienteCF: document.getElementById("clienteCF").value,
    subTotal: sumador,
    descuentos: parseFloat(descuentoTotal).toFixed(2),
    total: document.getElementById("precioTotal").value,
    productos: listaDeVentas,
  };
  if (aprobarFlag) {
    const respuesta = await fetch(
      "/api/presupuestos/edit/" + comprobanteCreadoId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(presupuestoData),
      }
    );
    jsonResp = await respuesta.json();
    console.log("se modifico el presupuesto: ", jsonResp);
    window.open("/api/presupuestos/find/" + jsonResp.comprobanteId, "_blank");
  } else {
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
}

async function altaRemito(acopioId) {
  const today = new Date();
  const validUntil = new Date(new Date().getTime() + 15 * 24 * 3600000);
  const remitoCliente = {
    cliente: document.getElementById("nombreCliente").innerText,
    clienteId,
    ventaId: "",
    acopioId: acopioId ? acopioId : "",
    listaRemitos: [],
  };
  console.log("acopio ID:", acopioId);
  if (!acopioId) {
    console.log("entra en remitoCompleto");
    let remitoCompleto;
    let listaDeVentas = [];
    let bultos = 0;
    let listaProductos = document.getElementsByName("productoVendido");
    for (producto of listaProductos) {
      listaDeVentas.push({
        cantidad: producto.querySelectorAll("input")[2].value,
        mercaderia:
          producto.querySelector("select").options[
            producto.querySelector("select").selectedIndex
          ].innerText,
      });
      bultos = (
        parseFloat(bultos) +
        parseFloat(producto.querySelectorAll("input")[2].value)
      ).toFixed(2);
    }
    remitoCompleto = {
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
      tipoFc: "R",
      clienteNombre: document.getElementById("nombreCliente").innerText,
      clienteCuit: clienteCuit || "",
      clienteTel: clienteTel || "",
      clienteDomicilio: document.getElementById("clienteDomicilio").value,
      clienteObse: document.getElementById("clienteObse").value,
      clienteCF: document.getElementById("clienteCF").value,
      productos: listaDeVentas,
      bultos,
    };
    remitoCliente.listaRemitos.push(remitoCompleto);
    console.log("es sin acopio, armando datos: ", remitoCompleto);
  }
  console.log("creando como remito (ver acopio ID tmb): ", remitoCliente);
  const res = await fetch("/api/remitos/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(remitoCliente),
  }).catch(() => alert("hubo un error en el alta de ventas"));
  const remitoIdCreado = await res.json();
  return remitoIdCreado;
}

async function altaVentas(acopioId = false) {
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
  let ventaCliente = {
    clienteId,
    cliente: document.getElementById("nombreCliente").innerText,
    clienteCuit: clienteCuit || "",
    clienteTel: clienteTel || "",
    clienteDomicilio: document.getElementById("clienteDomicilio").value,
    clienteCF: document.getElementById("clienteCF").value,
    comprobante: comprobante.value,
    comprobanteId: comprobanteCreadoId,
    comision: comision.value,
    fecha: fechaVenta.value,
    materialesVendidos: listaDeVentas,
    precioTotal: parseFloat(precioTotal.value),
    presupuesto: document.getElementById("presupuesto").checked,
  };

  if (acopioId) {
    ventaCliente.faltaAcopio = true;
    ventaCliente.acopioId = acopioId;
    ventaCliente.sinAcopio = false;
  } else {
    ventaCliente.faltaAcopio = acopioId;
    ventaCliente.sinAcopio = true;
  }
  if (!document.getElementById("presupuesto").checked) {
    const remitoId = await altaRemito(acopioId);

    ventaCliente.remitoId = remitoId;
  }
  //se modifica la venta
  if (aprobarFlag) {
    const respuesta = await fetch(
      "/api/ventas/edit/" + document.getElementById("ventaModId").value,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaCliente),
      }
    );

    const ventaGuardada = await respuesta.json();
    if (ventaGuardada.faltaAcopio) {
      await fetch("/api/acopio/edit/" + ventaGuardada.acopioId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ventaId: ventaGuardada._id,
        }),
      })
        .then(() => uploadTable())
        .catch(() => console.log("Hubo un error en el put"));
    }
  } else {
    //se crea la venta por primera vez
    const respuesta = await fetch("/api/ventas/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ventaCliente),
    });
    const ventaGuardada = await respuesta.json();
    if (ventaGuardada.faltaAcopio) {
      await fetch("/api/acopio/edit/" + ventaGuardada.acopioId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ventaId: ventaGuardada._id,
        }),
      }).catch(() => console.log("Hubo un error en el put"));
    }
    await fetch("/api/remitos/edit/" + ventaGuardada.remitoId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ventaId: ventaGuardada._id,
      }),
    })
      .then((x) => x.json())
      .then((res) => console.log("respuesta remito editado (FINAL): ", res))
      .then(() => {
        //se arma el boton
        document.getElementById("linkBtn").addEventListener("click", () => {
          window.open(
            "/api/remitos/find/" + ventaGuardada.remitoId + "/0",
            "_blank"
          );
        });
        if (!ventaGuardada.faltaAcopio) {
          $("#modalRemito").modal("show");
        }
      })
      .catch(() => console.log("Hubo un error en el put"));
  }
  uploadTable();
}

const uploadTable = async () => {
  ac = 0;
  fetch("/api/ventas/find/" + clienteId)
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      arrayConObjetos.map(({ precioTotal, presupuesto }) => {
        if (!presupuesto) {
          ac += precioTotal;
        }
      });
      document.getElementById("acumuladas").innerText = ac.toFixed(2);
      return arrayConObjetos;
    })
    .then((arrayConObjetos) => {
      $("#tablaVentasCliente").DataTable().clear().destroy();
      $("#tablaVentasCliente").DataTable({
        pageLength: 25,
        order: [[0, "desc"]],
        data: arrayConObjetos,
        columns: [
          {
            data: "fecha",
          },
          {
            data: "precioTotal",
          },
          {
            data: "comprobanteId",
            data: "_id",
            data: function (data, type, row) {
              if (data.comprobanteId) {
                return `
                <a class="btn btn-sm bg-purple" href ="/api/presupuestos/find/${data.comprobanteId}" target="_blank">Presupuesto<i class="pl-2 fa fa-receipt" ></i></a>`;
              } else return null;
            },
          },
          {
            data: "_id",
            data: "presupuesto",
            data: function (data, type, row) {
              if (data.presupuesto) {
                return `<a class="btn btn-sm bg-teal" onclick="aprobar('${data._id}')">Aprobar<i class="pl-2 fa fa-shopping-cart" ></i></a>`;
              }
              return `Aprobado`;
            },
          },
          {
            data: "presupuesto",
            data: "comprobante",
            data: function (data, type, row) {
              if (data.presupuesto) {
                return null;
              }
              return data.comprobante;
            },
          },
          {
            data: "presupuesto",
            data: "remitoId",
            data: "comprobante",
            data: function (data, type, row) {
              if (data.presupuesto) {
                return null;
              }
              return `<a href="/api/remitos/list/${data.remitoId}" class="btn btn-sm btn-warning">Remitos<i class="pl-2 fa fa-edit" ></i></a> `;
            },
          },
          {
            data: "presupuesto",
            data: "faltaAcopio",
            data: function (data, type, row) {
              if (data.presupuesto) {
                return null;
              } else if (data.faltaAcopio) {
                return "Falta";
              }
              return "Entregado";
            },
          },
          {
            data: "acopioId",
            data: "presupuesto",
            data: "faltaAcopio",
            data: "sinAcopio",
            data: function (data, type, row) {
              if (data.presupuesto) {
                return null;
              } else if (data.sinAcopio) {
                return `Sin Acopio`;
              } else if (data.faltaAcopio) {
                return `<a href="/api/acopio/find/${data.acopioId}" class="btn btn-sm bg-teal">Acopio<i class="pl-2 fa fa-eye" ></i></a>`;
              } else {
                return `<a href="/api/acopio/find/${data.acopioId}" class="btn btn-sm btn-success">Ver Acopios<i class="pl-2 fa fa-eye" ></i></a>`;
              }
            },
          },
          {
            data: "_id",
            data: "cliente",
            data: "acopioId",
            data: function (data, type, row) {
              if (data.acopioId) {
                return `
              <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.acopioId}')">Borrar<i class="pl-2 far fa-trash-alt" ></i></a>
              `;
              } else {
                return `
                <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}','')">Borrar<i class="pl-2 far fa-trash-alt" ></i></a>
                `;
              }
            },
          },
        ],
      });
      formVentas.reset();
      limpiarFilasVentas();
      fechaVenta.value = hoy;
      cuentaCorriente();
    })
    .catch((err) => {
      console.error(err);
    });
};

const aprobar = (id) => {
  document.getElementById("ventaModId").value = id;
  fetch("/api/ventas/get/" + id)
    .then((response) => response.json())
    .then((data) => presentarVenta(data))
    .then(() => scrollTo(0, 0))
    .catch((err) => console.error(err));
};

const presentarVenta = (datos) => {
  aprobarFlag = true;
  comprobanteCreadoId = datos.comprobanteId;
  document.getElementById("btnVenta").lastChild.data = `APROBAR PRESUPUESTO`;
  document.getElementById("btnVenta").classList.add("bg-purple");
  document.getElementById("btnVenta").classList.remove("btn-info");
  limpiarFilasVentas();
  let contador = 0;
  let listaDatos = datos.materialesVendidos;
  let ventaProducto = document.getElementsByName("productoVendido");
  for (let index = 1; index < listaDatos.length; index++) {
    agregarMercaderia();
  }
  for (producto of ventaProducto) {
    producto.querySelectorAll("input")[2].value = listaDatos[contador].cantidad;
    producto.querySelectorAll("input")[1].value =
      listaDatos[contador].precioFacturado;
    producto.querySelectorAll("input")[0].value =
      listaDatos[contador].precioLista;
    producto.querySelectorAll("input")[3].value = listaDatos[contador].subtotal;
    let selector = document
      .getElementById("columnaVenta" + contador)
      .querySelector("select");
    if (
      document
        .getElementsByName("mercaderias")
        [contador].contains(listaDatos[contador].mercaderia)
    ) {
      for (var i = 0, sL = selector.length; i < sL; i++) {
        if (selector.options[i].text == listaDatos[contador].mercaderia) {
          selector.selectedIndex = i;
          break;
        }
      }
    } else {
      toastr.error(
        'El producto: "' +
          listaDatos[contador].mercaderia +
          '" no fue encontrado en la base de datos',
        "AVISO IMPORTANTE:"
      );
    }
    contador++;
    calcularSubtotal();
  }
};

function preguntaBorrar(idVenta, idAcopio) {
  idAcopioDelete = idAcopio;
  document.getElementById(
    "modalDel"
  ).innerText = `Se está eliminando la venta del cliente ${cliente}`;
  document.getElementById("idBorrar").value = idVenta;
  $("#modalBorrar").modal("show");
  setTimeout(function () {
    document.getElementById("borrarBtn").removeAttribute("disabled");
    document.getElementById("borrarBtn").innerHTML = "ELIMINAR";
  }, 3000);
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
  if (idAcopioDelete) {
    eliminarAcopio(idAcopioDelete);
  }
};

const eliminarAcopio = (id) => {
  fetch(`/api/acopio/delete/${id}`, {
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

HTMLSelectElement.prototype.contains = function (value) {
  for (var i = 0, l = this.options.length; i < l; i++) {
    if (this.options[i].innerText == value) {
      return true;
    }
  }
  return false;
};

/*
const aprobarPagos = async () => {
  if (document.getElementById('fechaModal').value == '') {
    document.getElementById('fechaModal').classList.add('border-danger');
    toastr.error('Falta agregar fecha del pago');
  } else if (montoModal.value == '') {
    montoModal.classList.add('border-danger');
    toastr.error('Falta agregar monto del pago');
  } else if (
    metodoDePagoModal.value === 'cheque' &&
    numChequeModal.value == ''
  ) {
    numChequeModal.classList.add('border-danger');
    toastr.error('Falta agregar el numero del cheque');
  } else if (
    metodoDePagoModal.value === 'cheque' &&
    fechaChequeModal.value == ''
  ) {
    fechaChequeModal.classList.add('border-danger');
    toastr.error('Falta agregar la fecha del cheque');
  } else if (document.getElementById('idComprobante').value == '') {
    if (confirm('ha habido un error con el numero del comprobante')) {
      window.location.reload();
    }
  } else {
    $('#modalAprobar').modal('hide');
    document.getElementById('aprobarBtn').disabled = true;
    const datosPago = {
      fecha: document.getElementById('fechaModal').value,
      cliente: nombreCliente.innerText,
      clienteId,
      metodoDePago: metodoDePagoModal.value,
      nroComprobante: document.getElementById('idComprobante').value,
      observaciones: observacionesModal.value,
      monto: montoModal.value,
    };
    if (metodoDePagoModal.value === 'cheque') {
      datosPago['fechaCheque'] = fechaChequeModal.value;
      datosPago['numCheque'] = numChequeModal.value;
    }
    await fetch('/api/pagos/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosPago),
    })
      .then((x) => x.json())
      .then(() => {
        uploadTable();
        document.getElementById('aprobarBtn').removeAttribute('disabled');
        modalForm.reset();
      })
      .catch(() => alert('hubo un error en el alta de Pagos'));
  }
};
*/
