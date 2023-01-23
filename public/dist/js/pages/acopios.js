const formAcopio = document.getElementById("formAcopio");
const acopioId = document.getElementById("acopioId").value;
const ventaId = document.getElementById("ventaId").value;
const clienteId = document.getElementById("clienteId").value;
const clienteCuit = document.getElementById("clienteCuit").value;
const clienteTel = document.getElementById("clienteTel").value;
const listaRetiros = document.getElementsByName("retiro");
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

window.onload = (event) => {
  uploadTable();
  checkFaltantes();
  formAcopio.addEventListener("submit", async function (e) {
    e.preventDefault();
    await retirarMercaderia();
    location.reload();
  });
};

function checkFaltantes() {
  const faltantes = document.getElementsByName("faltantes");
  for (cant of faltantes) {
    if (cant.innerText == 0) {
      cant.parentElement.style.backgroundColor = "#eee";
      cant.nextElementSibling.firstElementChild.firstElementChild.setAttribute(
        "disabled",
        true
      );
    }
  }
}

function vaciaAcopio(check) {
  const listaCheckbox = document.getElementsByName("checks");
  if (check.checked) {
    for (checkbox of listaCheckbox) {
      if (!checkbox.checked) {
        checkbox.click();
      }
    }
  } else {
    for (checkbox of listaCheckbox) {
      if (checkbox.checked) {
        checkbox.click();
      }
    }
  }
}

function seleccionTotal(checkBox) {
  const input =
    checkBox.parentElement.previousElementSibling.firstElementChild
      .firstElementChild;
  if (checkBox.checked == true && input.max > 0) {
    input.value = input.max;
  } else {
    input.value = 0;
  }
}

const retirarMercaderia = async () => {
  await crearRemito();
  const listaNuevoAcopio = [];
  const listaMaterialesRetirados = [{ fechaRetiro: hoy }];
  for (retiro of listaRetiros) {
    const dataMercaderia = retiro.parentElement.parentElement.parentElement;
    if (retiro.value == "") {
      retiro.value = 0;
    } else {
      // if (
      //   parseFloat(retiro.value) > 0 &&
      //   parseFloat(retiro.value) <= parseFloat(retiro.max)
      // ) {
      const retiroJSON = {
        mercaderia: dataMercaderia.dataset.material,
        cantidadFaltante:
          dataMercaderia.dataset.cantidad - parseFloat(retiro.value),
        cantidadRetirada: parseFloat(retiro.value),
      };
      listaMaterialesRetirados.push(retiroJSON);
      // }
      listaNuevoAcopio.push({
        mercaderia: dataMercaderia.dataset.material,
        cantidadFaltante: dataMercaderia.dataset.cantidad - retiro.value,
      });
    }
  }
  if (listaMaterialesRetirados.length > 1) {
    const acopioJSON = {
      materialesAcopio: listaNuevoAcopio,
      materialesRetirados: listaMaterialesRetirados,
      ventaId: ventaId,
    };
    const res = await fetch("/api/acopio/edit/" + acopioId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(acopioJSON),
    });
    const respuesta = await res.json();
    if (respuesta.faltaAcopio) {
      await fetch("/api/ventas/edit/" + respuesta.ventaId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faltaAcopio: respuesta.faltaAcopio }),
      }).catch(() => console.log("Hubo un error en el put de ventas"));
    } else {
      console.log("falta retirar mercaderia");
    }
  }
};

const crearRemito = async () => {
  const today = new Date();
  const validUntil = new Date(new Date().getTime() + 15 * 24 * 3600000);
  let remitoCompleto;
  let listaProductos = [];
  let bultos = 0;
  const response = await fetch("/api/ventas/get/" + ventaId);
  const venta = await response.json();

  for (retiro of listaRetiros) {
    const dataMercaderia = retiro.parentElement.parentElement.parentElement;
    if (retiro.value == "" || retiro.value == 0) {
      retiro.value = 0;
    } else {
      // if (
      //   parseFloat(retiro.value) > 0 &&
      //   parseFloat(retiro.value) <= parseFloat(retiro.max)
      // ) {
      const retiroJSON = {
        mercaderia: dataMercaderia.dataset.material,
        cantidad: parseFloat(retiro.value),
      };
      listaProductos.push(retiroJSON);
      // }
    }
    bultos = (parseFloat(bultos) + parseFloat(retiro.value)).toFixed(2);
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
    clienteNombre: document.getElementById("clienteNombre").value,
    clienteCuit: venta.clienteCuit || "",
    clienteTel: venta.clienteTel || "",
    clienteDomicilio: venta.clienteDomicilio,
    clienteCF: venta.clienteCF,
    productos: listaProductos,
    bultos,
  };
  console.log(remitoCompleto);
  const res = await fetch("/api/remitos/add/" + venta.remitoId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(remitoCompleto),
  });
  const respuesta = await res.json();
  console.log(respuesta);
  window.open(
    "/api/remitos/find/" +
      venta.remitoId +
      "/" +
      (respuesta.listaRemitos.length - 1),
    "_blank"
  );
};

const uploadTable = () => {
  fetch("/api/acopio/list")
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      $("#tablaAcopios").DataTable().clear().destroy();
      $("#tablaAcopios").DataTable({
        pageLength: 50,
        info: false,
        paging: false,
        order: [[2, "desc"]],
        data: arrayConObjetos,
        columns: [
          {
            data: "createdAt",
            render: function (data, type, row) {
              if (data === null) return "-";
              var tdat = data.split("T");
              var fecha = tdat[0].split("-");
              return fecha[2] + "-" + fecha[1] + "-" + fecha[0];
            },
          },
          {
            data: "cliente",
          },
          {
            data: "updatedAt",
            render: function (data, type, row) {
              if (data === null) return "-";
              var tdat = data.split("T");
              var fecha = tdat[0].split("-");
              return fecha[2] + "-" + fecha[1] + "-" + fecha[0];
            },
          },
          {
            data: "_id",
            data: "cliente",
            data: function (data, type, row) {
              return `<a href="/api/acopio/find/${data._id}" class="btn btn-sm bg-teal">Ver Acopio <i class="fa fa-eye" ></i></a>
                <a hidden class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.cliente}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            },
          },
        ],
      });
      formAcopio.reset();
      uploadTableStock(arrayConObjetos);
    })
    .catch((err) => {
      console.error(err);
    });
};

const uploadTableStock = async (arr) => {
  let acopioList = [];
  await arr.map((acopio) => {
    acopioList.push(acopio.materialesAcopio);
  });

  const data = acopioList.flat();
  const res = data.filter(({ cantidadFaltante }) => cantidadFaltante > 0);
  const total = res.reduce((c, v) => {
    c[v.mercaderia] = (c[v.mercaderia] || 0) + parseInt(v.cantidadFaltante);
    return c;
  }, {});
  const array = [];

  for (let [key, value] of Object.entries(total)) {
    let obj = {};
    obj["mercaderia"] = key;
    obj["cantidad"] = value;
    array.push(obj);
  }

  $("#tablaStock").DataTable().clear().destroy();
  const table = $("#tablaStock").DataTable({
    info: false,
    paging: false,
    pageLength: 50,
    data: array,
    columns: [
      {
        data: "mercaderia",
      },
      {
        data: "cantidad",
      },
    ],
  });
};

function preguntaBorrar(idAcopio, nombre) {
  document.getElementById(
    "modalDel"
  ).innerHTML = `Se está eliminando el cliente: <b>${nombre}</b>`;
  document.getElementById("idBorrar").value = idAcopio;
  $("#modalBorrar").modal("show");
  setTimeout(function () {
    document.getElementById("borrarBtn").removeAttribute("disabled");
    document.getElementById("borrarBtn").innerHTML = "ELIMINAR";
  }, 4000);
}

const eliminarAcopio = () => {
  let id = document.getElementById("idBorrar").value;
  fetch(`/api/acopios/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(() => uploadTable())
    .catch((err) => console.log(err));
};
