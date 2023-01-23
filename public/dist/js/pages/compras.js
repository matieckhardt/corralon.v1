const formCompras = document.getElementById("formCompras");
const listaProveedores = document.getElementById("listaProveedores");
const listaProductos = document.getElementById("listaProductos");
const filaProducto = document.getElementById("filaProducto");
const comprobante = document.getElementById("comprobante");
const iva = document.getElementById("iva");
const ivaPesos = document.getElementById("ivaPesos");
const ivaTotal = document.getElementById("ivaTotal");
const montoTotal = document.getElementById("montoTotal");
const fechaFc = document.getElementById("fechaFc");
const precioBruto = document.getElementById("precioBruto");
const precio = document.getElementById("precio");
const subtotal = document.getElementById("subtotal");
const cantidad = document.getElementById("cantidad");
const marca = document.getElementById("marca");
let idEditable = 0;
let count = 1;
// fecha de facturacion maxima
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
fechaFc.setAttribute("max", hoy);

// Handler de vista para agregar productos
function addProduct() {
  listaProveedores.setAttribute("disabled", "disabled");
  comprobante.setAttribute("disabled", "disabled");
  let clon = filaProducto.firstElementChild.cloneNode(true);
  clon.id = "columnaProducto" + count;
  for (var i = 0; i < clon.getElementsByTagName("select").length; i++) {
    clon.getElementsByTagName("select")[i].id =
      filaProducto.getElementsByTagName("select")[i].id + count;
    clon.getElementsByTagName("select")[i].value = "";
    // lista de productos clonada
    clon
      .getElementsByTagName("select")[0]
      .addEventListener("change", function (e) {
        var opcionElegida = e.target.options.selectedIndex;
        var productoId = e.srcElement[opcionElegida].id;
        presentarDatosProducto(productoId);
      });
    clon.getElementsByTagName("select")[0].removeAttribute("disabled");
    // inicializar guardar precio en 'No'
    clon.getElementsByTagName("select")[1].value = "No";
    // iva clonado
    clon.getElementsByTagName("select")[2].value =
      filaProducto.firstElementChild.getElementsByTagName("select")[2].value;
    clon
      .getElementsByTagName("select")[2]
      .addEventListener("change", function (e) {
        calcularIva();
        calcularSubtotal();
      });
  }
  for (var i = 0; i < clon.getElementsByTagName("input").length; i++) {
    clon.getElementsByTagName("input")[i].id =
      filaProducto.getElementsByTagName("input")[i].id + count;
    clon.getElementsByTagName("input")[i].value = 0;
  }
  let precioProd = "precio" + count;
  let cantidadProd = "cantidad" + count;
  filaProducto.appendChild(clon);
  document
    .getElementById(precioProd.toString())
    .addEventListener("change", function () {
      calcularIva();
      calcularSubtotal();
    });
  document
    .getElementById(cantidadProd.toString())
    .addEventListener("change", function () {
      calcularSubtotal();
    });
  document.getElementById(cantidadProd.toString()).value = 1;
  count++;
  listaProductos.setAttribute("disabled", "disabled");
  for (let i = 1; i < count - 1; i++) {
    document
      .getElementById("listaProductos" + i)
      .setAttribute("disabled", "disabled");
  }
  document.getElementById("borrarProducto").style.display = "inline-block";
}

// Handler de vista para borrar productos
function deleteProduct() {
  if (filaProducto.lastChild != filaProducto.firstElementChild) {
    filaProducto.lastChild.remove();
    count--;
    esconderDelete();
    calcularIva();
    if (count != 1) {
      document
        .getElementById("listaProductos" + (count - 1))
        .removeAttribute("disabled");
    }
  }
}

// Handler cuando tenes un solo producto
function esconderDelete() {
  if (count == 1) {
    document.getElementById("borrarProducto").style.display = "none";
    comprobante.removeAttribute("disabled");
    listaProveedores.removeAttribute("disabled");
    listaProductos.removeAttribute("disabled");
  }
}

function calcularIva() {
  for (let i = 0; i < count; i++) {
    let porcentaje = parseFloat(iva.value / 100);
    ivaPesos.value = (precio.value * porcentaje).toFixed(2);
    if (comprobante.value == "Fc A") {
      if (porcentaje == 1)
        precioBruto.value = parseFloat(ivaPesos.value).toFixed(2);
      else {
        precioBruto.value = parseFloat(
          parseFloat(precio.value) + parseFloat(ivaPesos.value)
        ).toFixed(2);
      }
    } else {
      precioBruto.value = precio.value;
    }
    if (i != 0) {
      porcentaje = document.getElementById("iva" + i).value / 100;
      document.getElementById("ivaPesos" + i).value = (
        document.getElementById("precio" + i).value * porcentaje
      ).toFixed(2);
      if (comprobante.value == "Fc A") {
        if (porcentaje == 1)
          document.getElementById("precioBruto" + i).value = parseFloat(
            document.getElementById("ivaPesos" + i).value
          ).toFixed(2);
        else {
          document.getElementById("precioBruto" + i).value = parseFloat(
            parseFloat(document.getElementById("precio" + i).value) +
              parseFloat(document.getElementById("ivaPesos" + i).value)
          ).toFixed(2);
        }
      } else {
        document.getElementById("precioBruto" + i).value =
          document.getElementById("precio" + i).value;
      }
    }
    calcularIvaTotal();
  }
}

function calcularSubtotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0) {
      subtotal.value = parseFloat(
        parseFloat(precioBruto.value) * parseFloat(cantidad.value)
      ).toFixed(2);
    } else {
      let precioBrutoProd = document.getElementById("precioBruto" + i);
      let cantidadProd = document.getElementById("cantidad" + i);
      document.getElementById("subtotal" + i).value = parseFloat(
        parseFloat(precioBrutoProd.value) * parseFloat(cantidadProd.value)
      ).toFixed(2);
    }
  }
  calcularIvaTotal();
}

function calcularIvaTotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0) {
      ivaTotal.value = parseFloat(
        parseFloat(ivaPesos.value) * parseFloat(cantidad.value)
      ).toFixed(2);
    } else {
      ivaProducto = parseFloat(
        parseFloat(document.getElementById("ivaPesos" + i).value) *
          parseFloat(document.getElementById("cantidad" + i).value)
      ).toFixed(2);
      ivaTotal.value = parseFloat(
        parseFloat(ivaProducto) + parseFloat(ivaTotal.value)
      ).toFixed(2);
    }
  }
  calcularMontoTotal();
}

function calcularMontoTotal() {
  for (let i = 0; i < count; i++) {
    if (i == 0)
      montoTotal.value =
        parseFloat(precioBruto.value) * parseFloat(cantidad.value);
    else {
      let totales =
        parseFloat(document.getElementById("precioBruto" + i).value) *
        parseFloat(document.getElementById("cantidad" + i).value);
      montoTotal.value = parseFloat(
        parseFloat(montoTotal.value) + parseFloat(totales)
      ).toFixed(2);
    }
  }
}

listaProductos.addEventListener("click", (e) => {
  if (!comprobante.value) {
    toastr.error("elegir comprobante");
    comprobante.focus();
  }
});

comprobante.addEventListener("change", function (e) {
  // limpia la lista de opciones anteriores de iva
  while (iva.childElementCount != 0) {
    iva.lastElementChild.remove();
  }
  // manejos de la eleccion de comprobantes
  switch (e.target.value) {
    case "Fc A":
      var opcion = document.createElement("option");
      opcion.appendChild(document.createTextNode("10.5%"));
      opcion.value = 10.5;
      iva.appendChild(opcion);
      var opcion2 = document.createElement("option");
      opcion2.appendChild(document.createTextNode("21%"));
      opcion2.value = 21;
      opcion2.setAttribute("selected", "selected");
      iva.appendChild(opcion2);
      var opcion3 = document.createElement("option");
      opcion3.appendChild(document.createTextNode("27%"));
      opcion3.value = 27;
      iva.appendChild(opcion3);
      var opcion4 = document.createElement("option");
      opcion4.appendChild(document.createTextNode("30%"));
      opcion4.value = 30;
      iva.appendChild(opcion4);
      var opcion5 = document.createElement("option");
      opcion5.appendChild(document.createTextNode("0%"));
      opcion5.value = 0;
      iva.appendChild(opcion5);
      var opcion6 = document.createElement("option");
      opcion6.appendChild(document.createTextNode("Percepcion RG2408"));
      opcion6.value = 100;
      iva.appendChild(opcion6);
      calcularIva();
      break;
    default:
      var opcion = document.createElement("option");
      opcion.appendChild(document.createTextNode("0%"));
      opcion.value = 0;
      opcion.setAttribute("selected", "selected");
      iva.appendChild(opcion);
      calcularIva();
      break;
  }
  calcularSubtotal();
});

// handler para vaciar los campos de los productos
function limpiarFilasProductos(lista) {
  for (var i = 0; i < lista.getElementsByTagName("input").length; i++) {
    lista.getElementsByTagName("input")[i].value = 0;
  }
  for (var j = 0; j < document.getElementsByName("cantidad").length; j++) {
    document.getElementsByName("cantidad")[j].value = "1";
  }
  while (lista.childElementCount != 1) {
    if (lista.firstElementChild != lista.lastElementChild)
      lista.lastElementChild.remove();
  }
}

// setup de ejecucion inicial con handlers y eventlisteners
window.onload = (event) => {
  uploadTable();
  listarProveedores();
  precio.addEventListener("change", function () {
    calcularIva();
    calcularSubtotal();
  });
  formCompras.addEventListener("submit", function (e) {
    altaCompra();
    e.preventDefault();
  });
  listaProveedores.addEventListener("change", function (e) {
    presentarDatosProveedor(
      e.target.selectedOptions[0].getAttribute("data-id")
    );
    listarProductos(e.target.value);
    limpiarFilasProductos(filaProducto);
  });
  listaProductos.addEventListener("change", () => {
    var productoId = listaProductos.selectedOptions[0].id;
    presentarDatosProducto(productoId);
  });
  iva.addEventListener("change", function () {
    calcularIva();
    calcularSubtotal();
  });
  cantidad.addEventListener("change", function () {
    calcularSubtotal();
    calcularMontoTotal();
  });
};

// Funcion que los datos del proveedor seleccionado
async function presentarDatosProveedor(idProveedor) {
  await fetch("/api/proveedores/finder/" + idProveedor)
    .then((lista) => lista.json())
    .then((proveedor) => {
      document.getElementById("razonSocial").value =
        proveedor.razonSocial || "";
      document.getElementById("condicion").value = proveedor.fiscal || "";
      document.getElementById("tipo").value = proveedor.tipo || "";
      document.getElementById("cuit").value = proveedor.cuit || "";
      document.getElementById("proveedorId").value = proveedor._id;
    })
    .catch((err) => {
      console.error(err);
    });
}

// Funcion que los datos del producto seleccionado
async function presentarDatosProducto(idProducto) {
  await fetch("/api/productos/find/" + idProducto)
    .then((data) => data.json())
    .then((productoElegido) => {
      if (count == 1) {
        marca.value = productoElegido.marca;
        precio.value = productoElegido.precio;
        iva.value = productoElegido.iva;
        precio.addEventListener("change", function () {
          calcularIva();
          calcularSubtotal();
        });
      }
      // caso que se seleccione mas de un producto
      else {
        var productoCount = count - 1;
        document.getElementById("marca" + productoCount).value =
          productoElegido.marca;
        document.getElementById("precio" + productoCount).value =
          productoElegido.precio;
        document.getElementById("iva" + productoCount).value =
          productoElegido.iva;
        document
          .getElementById("precio" + productoCount)
          .addEventListener("change", function () {
            calcularIva();
            calcularSubtotal();
          });
      }
      calcularIva();
      calcularSubtotal();
    })
    .catch((err) => {
      console.error(err);
    });
}

// Creacion de compras en base
async function altaCompra() {
  let nombreProv =
    listaProveedores.options[listaProveedores.selectedIndex].value;
  let jsonProductos = [
    {
      nombreProducto: listaProductos.value,
      marca: marca.value,
      precio: parseFloat(precio.value),
      cantidad: parseFloat(cantidad.value),
      subtotal: parseFloat(subtotal.value),
      porcentajeIVA: parseFloat(iva.value),
      montoIVA: parseFloat(ivaPesos.value),
      precioBruto: parseFloat(precioBruto.value),
    },
  ];
  // Handler para el caso que haya mas de un producto
  for (let i = 1; i < count; i++) {
    let producto = {
      nombreProducto: document.getElementById("listaProductos" + i).value,
      marca: document.getElementById("marca" + i).value,
      precio: parseFloat(document.getElementById("precio" + i).value),
      cantidad: parseFloat(document.getElementById("cantidad" + i).value),
      subtotal: parseFloat(document.getElementById("subtotal" + i).value),
      porcentajeIVA: parseFloat(document.getElementById("iva" + i).value),
      montoIVA: parseFloat(document.getElementById("ivaPesos" + i).value),
      precioBruto: parseFloat(document.getElementById("precioBruto" + i).value),
    };
    jsonProductos.push(producto);
  }
  // json con la compra con productos
  let jsonCompra = {
    proveedor: nombreProv,
    razonSocial: document.getElementById("razonSocial").value,
    tipoProveedor: document.getElementById("tipo").value,
    condicionFiscal: document.getElementById("condicion").value,
    cuit: document.getElementById("cuit").value,
    comprobante: comprobante.value,
    factura: document.getElementById("numFc").value,
    fechaFc: fechaFc.value,
    productos: jsonProductos,
    observaciones: document.getElementById("observaciones").value,
    montoTotal: parseFloat(montoTotal.value),
    ivaTotal: parseFloat(ivaTotal.value),
  };

  await fetch("/api/compras/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonCompra),
  })
    .then((x) => console.log(x))
    .then(() => uploadTable())
    .catch(() => false);
}

function preguntaBorrar(id, nombre, monto) {
  document.getElementById(
    "modalDel"
  ).innerHTML = `Se está eliminando la compra al proveedor: <b>${nombre}</b> por <b>$ ${monto}</b>`;
  document.getElementById("idBorrar").value = id;
  $("#modalBorrar").modal("show");
  setTimeout(function () {
    document.getElementById("borrarBtn").removeAttribute("disabled");
    document.getElementById("borrarBtn").innerHTML = "ELIMINAR";
  }, 4000);
}

async function eliminarCompra() {
  let id = document.getElementById("idBorrar").value;
  await fetch(`/api/compras/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      uploadTable();
      id.value = "";
      document.getElementById("borrarBtn").setAttribute("disabled", "disabled");
    })
    .catch((err) => console.log(err));
}

// Funcion para presentar la lista de proveedores
async function listarProveedores() {
  await fetch("/api/proveedores/list")
    .then((response) => response.json())
    .then((docs) => {
      docs.map((doc) => {
        let proveedor = document.createElement("option");
        proveedor.appendChild(document.createTextNode(doc.nombre));
        proveedor.value = doc.nombre;
        proveedor.dataset.id = doc._id;
        listaProveedores.appendChild(proveedor);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

async function cambiarPrecio(productoId, precio) {
  let precioNuevo = precio;
  await db
    .collection("productos")
    .doc(productoId)
    .get()
    .then((doc) => {
      let producto = doc.data();
      let cambioPrecio = {
        FechaCambio: hoy,
        PrecioAnterior: producto.Precio,
      };
      producto.Precio = precioNuevo;
      if (producto.PreciosAnteriores) {
        producto.PreciosAnteriores.push(cambioPrecio);
        db.collection("productos").doc(productoId).update(producto);
      } else {
        producto.PreciosAnteriores = [cambioPrecio];
        db.collection("productos").doc(productoId).update(producto);
      }
    });
}

// Handler para cuando se cambia de proveedor, limpia la lista de productos
function limpiarListaProductos(lista) {
  $(lista).empty();
  var option = document.createElement("option");
  option.setAttribute("selected", "selected");
  option.setAttribute("hidden", "hidden");
  option.setAttribute("disabled", "disabled");
  lista.appendChild(option);
}

// Funcion para presentar la lista de productos
async function listarProductos(nombreProveedor) {
  await fetch("/api/productos/list/" + nombreProveedor)
    .then((response) => response.json())
    .then((productos) => {
      limpiarListaProductos(listaProductos);
      productos.forEach((producto) => {
        let productoOpcion = document.createElement("option");
        productoOpcion.appendChild(document.createTextNode(producto.nombre));
        productoOpcion.value = producto.nombre;
        productoOpcion.id = producto._id;
        listaProductos.appendChild(productoOpcion);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

// carga de la tabla de compras

const uploadTable = () => {
  fetch("/api/compras/2022-" + document.getElementById("mesSelect").value)
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      $("#tablaCompras").DataTable().clear().destroy();
      $("#tablaCompras").DataTable({
        pageLength: 25,
        data: arrayConObjetos,
        columns: [
          {
            data: "fechaFc",
            render: function (data, type, row) {
              if (data === null) return "-";
              var tdat = data.split("T");
              var fecha = tdat[0].split("-");
              return fecha[2] + "-" + fecha[1] + "-" + fecha[0];
            },
          },
          {
            data: "tipoProveedor",
          },
          {
            data: "proveedor",
          },
          {
            data: "cuit",
          },
          {
            data: "factura",
          },
          {
            data: "montoTotal",
          },
          {
            data: "_id",
            data: "proveedor",
            data: "montoTotal",
            data: function (data, type, row) {
              return `
              <a class="btn btn-sm btn-success"  href="/api/compras/find/${data._id}" target="blank" >Ver Compra <i class="fa fa-edit"></i></a>
              <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}','${data.proveedor}','${data.montoTotal}')">Borrar <i class="far fa-trash-alt"></i></a>`;
            },
          },
        ],
      });
      formCompras.reset();
    })
    .catch((err) => {
      console.error(err);
    });
};

async function mostrarCompra(id) {
  await fetch("/api/compras/find/" + id)
    .then((response) => response.json())
    .then((compra) => {
      formCompras.reset();
      while (count != 1) {
        deleteProduct();
      }
      return compra;
    })
    .then((compra) => {
      volcarDatos(compra);
      console.log(compra);
      return compra.productos;
    })
    .then((prodCompras) => {
      console.log(prodCompras);
    })
    .catch((err) => {
      console.error(err);
    });
}

async function volcarDatos(compra) {
  try {
    listaProveedores.contains(compra.proveedor)
      ? (listaProveedores.value = compra.proveedor)
      : toastr.error(
          'El proveedor de la compra: "' +
            compraActual.proveedor +
            '" no fue encontrado en la base de datos'
        );
    comprobante.value = compra.comprobante;
    await listarProductos(compra.proveedor);
    await listaProveedores.dispatchEvent(new Event("change"));
    await comprobante.dispatchEvent(new Event("change"));
  } catch (err) {
    console.error(err);
  }
  document.getElementById("razonSocial").value = compra.razonSocial;
  document.getElementById("condicion").value = compra.condicionFiscal;
  document.getElementById("tipo").value = compra.tipoProveedor;
  document.getElementById("numFc").value = compra.factura;
  fechaFc.value = compra.fechaFc;
  montoTotal.value = compra.montoTotal;
  ivaTotal.value = compra.ivaTotal;
  document.getElementById("cuit").value = compra.cuit;
  document.getElementById("observaciones").value = compra.observaciones;
  limpiarFilasProductos(filaProducto);
  await listaProveedores.dispatchEvent(new Event("change"));

  await agregarProductos(compra.productos);
}

async function agregarProductos(productos) {
  volcarProductos(productos);
}

function volcarProductos(productos) {
  for (let i = 0; i < productos.length; i++) {
    let productoActual = productos[i];
    if (i == 0) {
      marca.value = productoActual.marca;
      precio.value = productoActual.precio;
      cantidad.value = productoActual.cantidad;
      subtotal.value = productoActual.subtotal;
      iva.value = productoActual.porcentajeIVA;
      ivaPesos.value = productoActual.montoIVA;
      precioBruto.value = productoActual.precioBruto;
      listaProductos.contains(productoActual.nombreProducto)
        ? (listaProductos.value = productoActual.nombreProducto)
        : toastr.error(
            'El producto: "' +
              productoActual.nombreProducto +
              '" no fue encontrado en la base de datos',
            "AVISO IMPORTANTE:"
          );
    } else {
      addProduct();
      document.getElementById("marca" + i).value = productoActual.marca;
      document.getElementById("precio" + i).value = productoActual.precio;
      document.getElementById("cantidad" + i).value = productoActual.cantidad;
      document.getElementById("subtotal" + i).value = productoActual.subtotal;
      document.getElementById("iva" + i).value = productoActual.porcentajeIVA;
      document.getElementById("ivaPesos" + i).value = productoActual.montoIVA;
      document.getElementById("precioBruto" + i).value =
        productoActual.precioBruto;
      document
        .getElementById("listaProductos" + i)
        .contains(productoActual.nombreProducto)
        ? (document.getElementById("listaProductos" + i).value =
            productoActual.nombreProducto)
        : toastr.error(
            'El producto: "' +
              productoActual.nombreProducto +
              '" no fue encontrado en la base de datos',
            "AVISO IMPORTANTE:"
          );
    }
  }
}

HTMLSelectElement.prototype.contains = function (value) {
  for (let i = 0, l = this.options.length; i < l; i++) {
    if (this.options[i].value == value) {
      return true;
    }
  }
  return false;
};
