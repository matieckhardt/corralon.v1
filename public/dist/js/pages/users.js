window.onload = (event) => {
  uploadTable();
};

const uploadTable = () => {
  fetch("/api/users/list")
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      $("#tablaClientes").DataTable().clear().destroy();
      $("#tablaClientes").DataTable({
        pageLength: 25,
        data: arrayConObjetos,
        columns: [
          {
            data: "nombre",
          },
          {
            data: "email",
          },
          {
            data: "role",
          },
          {
            data: "_id",
            data: "nombre",
            data: function (data, type, row) {
              return `<a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            },
          },
        ],
      });
      formClientes.reset();
    })
    .catch((err) => {
      console.error(err);
    });
};

function preguntaBorrar(idCliente, nombre) {
  document.getElementById(
    "modalDel"
  ).innerHTML = `Se está eliminando el cliente: <b>${nombre}</b>`;
  document.getElementById("idBorrar").value = idCliente;
  $("#modalBorrar").modal("show");
  setTimeout(function () {
    document.getElementById("borrarBtn").removeAttribute("disabled");
    document.getElementById("borrarBtn").innerHTML = "ELIMINAR";
  }, 4000);
}

const eliminarCliente = () => {
  let id = document.getElementById("idBorrar").value;
  fetch(`/api/clientes/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => uploadTable())
    .catch((err) => console.log(err));
};

const mostrarCliente = async (idCliente) => {
  document.getElementById("clienteIdEdit").value = idCliente;
  const responseCliente = await fetch(`/api/clientes/findOne/${idCliente}`);
  const clientJson = await responseCliente.json();
  console.log(clientJson);
  document.getElementById("nombreEdit").value = clientJson.nombre;
  document.getElementById("razonSocialEdit").value = clientJson.RazonSocial;
  document.getElementById("dniEdit").value = clientJson.dni;
  document.getElementById("emailEdit").value = clientJson.email;
  document.getElementById("telEdit").value = clientJson.tel;
  document.getElementById("condicionFiscalEdit").value = clientJson.fiscal;
  document.getElementById("dirEdit").value = clientJson.address;
  document.getElementById("localidadEdit").value = clientJson.localidad;
  document.getElementById("observacionesEdit").value = clientJson.observaciones;
  $("#modalEdit").modal("show");
};

const editarCliente = async () => {
  let idEdit = document.getElementById("clienteIdEdit").value;
  const jsonEdit = {
    nombre: document.getElementById("nombreEdit").value,
    RazonSocial: document.getElementById("razonSocialEdit").value,
    dni: document.getElementById("dniEdit").value,
    email: document.getElementById("emailEdit").value,
    tel: document.getElementById("telEdit").value,
    fiscal: document.getElementById("condicionFiscalEdit").value,
    address: document.getElementById("dirEdit").value,
    localidad: document.getElementById("localidadEdit").value,
    observaciones: document.getElementById("observacionesEdit").value,
  };
  Object.keys(jsonEdit).forEach((key) => {
    if (jsonEdit[key] === "") {
      delete jsonEdit[key];
    }
  });
  fetch(`/api/clientes/edit/${idEdit}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonEdit),
  })
    .then((res) => res.json())
    .then((modificado) =>
      toastr.success(
        `El cliente ${modificado.nombre} fue modificado con exito`,
        "AVISO"
      )
    )
    .then(() => uploadTable())
    .catch(() => toastr.error("El cliente no pudo modificarse", "AVISO"));
};
