window.onload = (event) => {
  uploadTable();
  obtenerProveedores();
};

const obtenerProveedores = async function () {
  await fetch("/api/proveedores/list")
    .then((lista) => lista.json())
    .then((datos) =>
      datos.map((jsonData) => {
        const option = document.createElement("option");
        option.value = jsonData.nombre;
        option.innerText = jsonData.nombre;
        document.getElementById("listaProveedores").add(option);
      })
    )
    .catch((err) => console.log(err));

  await fetch("/api/rubros/list")
    .then((lista) => lista.json())
    .then((datos) =>
      datos.map((jsonData) => {
        if (jsonData.activo) {
          const option = document.createElement("option");
          option.value = jsonData.nombre;
          option.innerText = jsonData.nombre;
          document.getElementById("rubro").add(option);
        }
      })
    )
    .catch((err) => console.log(err));
};

const uploadTable = () => {
  fetch("/api/productos/list")
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      $("#tablaProductos").DataTable().clear().destroy();
      $("#tablaProductos").DataTable({
        pageLength: 25,
        data: arrayConObjetos,
        columns: [
          {
            data: "nombre",
          },
          {
            data: "proveedor",
          },
          {
            data: "marca",
          },
          {
            data: "precio",
          },
          {
            data: "iva",
          },
          {
            data: "rubro",
          },
          {
            data: "_id",
            data: "nombre",
            data: function (data, type, row) {
              return `<a href="/api/productos/find/${data._id}" hidden class="btn btn-sm btn-warning" href="#" onclick="mostrarCliente('${data._id}')">Editar <i class="fa fa-edit" ></i></a>
                <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            },
          },
        ],
      });
      formProductos.reset();
    })
    .catch((err) => {
      console.error(err);
    });
};

function preguntaBorrar(idProducto, nombre) {
  document.getElementById(
    "modalDel"
  ).innerHTML = `Se está eliminando el cliente: <b>${nombre}</b>`;
  document.getElementById("idBorrar").value = idProducto;
  $("#modalBorrar").modal("show");
  setTimeout(function () {
    document.getElementById("borrarBtn").removeAttribute("disabled");
    document.getElementById("borrarBtn").innerHTML = "ELIMINAR";
  }, 4000);
}

const eliminarProducto = () => {
  let id = document.getElementById("idBorrar").value;
  fetch(`/api/productos/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(() => uploadTable())
    .catch((err) => console.log(err));
};
