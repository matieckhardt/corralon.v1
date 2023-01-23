window.onload = (event) => {
  uploadTable();
};

async function manejarEmitido(elem) {
  console.log(elem.dataset.id, elem.checked);
  await fetch("/api/ventas/edit/" + elem.dataset.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emitido: elem.checked }),
  }).catch(() => console.log("Hubo un error en el put"));
}

const uploadTable = () => {
  const yearFilter = document.getElementById("yearSelect").value;
  fetch(
    "/api/comprobantes/" +
      yearFilter +
      "-" +
      document.getElementById("mesSelect").value
  )
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      console.log(arrayConObjetos.filter(({ presupuesto }) => !presupuesto));
      $("#tablaComprobantes").DataTable().clear().destroy();
      $("#tablaComprobantes").DataTable({
        pageLength: 25,
        data: arrayConObjetos,
        order: [[0, "desc"]],
        columns: [
          {
            data: "fecha",
          },
          {
            data: "comprobante",
            data: "emitido",
            data: "_id",
            data: function (data, type, row) {
              if (data.comprobante === "A" || data.comprobante === "B") {
                return `
                ${
                  data.emitido
                    ? `<label style="display: inline-block; padding: 0.5em 1.25em; margin: 0">
                        <input aria-label="expanded click" checked type="checkbox" name="emitido" data-id="${data._id}" onchange="manejarEmitido(this)" />
                      </label>`
                    : `<label style="display: inline-block; padding: 0.5em 1.25em; margin: 0">
                        <input aria-label="expanded click" type="checkbox" name="emitido" data-id="${data._id}" onchange="manejarEmitido(this)" />
                    </label>`
                }
                `;
              } else {
                return null;
              }
            },
          },
          {
            data: "comprobante",
          },
          {
            data: "cliente",
          },
          {
            data: "clienteCuit",
            data: function (data, type, row) {
              if (data.clienteCuit != undefined) {
                return `${data.clienteCuit}`;
              } else return "-";
            },
          },
          {
            data: "precioTotal",
          },
          {
            data: "comision",
          },
          {
            data: "comprobanteId",
            data: "_id",
            data: "compobante",
            data: function (data, type, row) {
              if (data.comprobanteId) {
                return `
                <a class="btn btn-sm bg-purple" href ="/api/presupuestos/find/${data.comprobanteId}">Comprobante<i class="pl-2 fa fa-receipt" ></i></a>
                 <a href="/api/materiales/find/${data._id}" class="btn btn-sm btn-warning" href="#" hidden onclick="mostrarCliente('${data._id}')">Editar <i class="fa fa-edit" ></i></a>
              <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.comprobanteId}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
              } else
                return `
              <a href="/api/materiales/find/${data._id}" class="btn btn-sm btn-warning" href="#" hidden onclick="mostrarCliente('${data._id}')">Editar <i class="fa fa-edit" ></i></a>
              <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.comprobanteId}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            },
          },
        ],
      });
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

const eliminarMaterial = () => {
  let id = document.getElementById("idBorrar").value;
  fetch(`/api/materiales/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(() => uploadTable())
    .catch((err) => console.log(err));
};
