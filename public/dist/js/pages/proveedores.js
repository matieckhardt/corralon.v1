window.onload = (event) => {
  uploadTable();
};

const uploadTable = () => {
  fetch("/api/proveedores/list")
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      $("#tablaProveedores").DataTable().clear().destroy();
      $("#tablaProveedores").DataTable({
        pageLength: 25,
        data: arrayConObjetos,
        columns: [
          {
            data: "nombre",
          },
          {
            data: "razonSocial",
          },
          {
            data: "cuit",
          },
          {
            data: "tel",
          },
          {
            data: "localidad",
          },
          {
            data: "tipo",
          },
          {
            data: "_id",
            data: "nombre",
            data: function (data, type, row) {
              return `<a href="/api/proveedores/find/${data._id}" hidden class="btn btn-sm btn-warning" href="#" onclick="mostrarCliente('${data._id}')">Editar <i class="fa fa-edit" ></i></a>
                <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            },
          },
        ],
      });
      formProveedor.reset();
    })
    .catch((err) => {
      console.error(err);
    });
};

function preguntaBorrar(idProveedor, nombre) {
  document.getElementById(
    "modalDel"
  ).innerHTML = `Se está eliminando el cliente: <b>${nombre}</b>`;
  document.getElementById("idBorrar").value = idProveedor;
  $("#modalBorrar").modal("show");
  setTimeout(function () {
    document.getElementById("borrarBtn").removeAttribute("disabled");
    document.getElementById("borrarBtn").innerHTML = "ELIMINAR";
  }, 4000);
}

const eliminarProveedor = () => {
  let id = document.getElementById("idBorrar").value;
  fetch(`/api/proveedores/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(() => uploadTable())
    .catch((err) => console.log(err));
};
