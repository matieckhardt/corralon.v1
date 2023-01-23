window.onload = (event) => {
  uploadTable();
};

const uploadTable = () => {
  fetch("/api/materiales/list")
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      $("#tablaMateriales").DataTable().clear().destroy();
      $("#tablaMateriales").DataTable({
        pageLength: 25,
        data: arrayConObjetos,
        columns: [
          {
            data: "nombre",
          },
          {
            data: "stock",
          },
          {
            data: "precio",
          },
          {
            data: "rubro",
          },
          {
            data: "_id",
            data: "nombre",
            data: function (data, type, row) {
              return `<a class="btn btn-sm btn-warning" href="#" onclick="editarModal('${data._id}')">Editar <i class="fa fa-edit" ></i></a>
              <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}', '${data.nombre}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            },
          },
        ],
      });
      formMateriales.reset();
    })
    .catch((err) => {
      console.error(err);
    });
};

function preguntaBorrar(idMaterial, nombre) {
  document.getElementById(
    "modalDel"
  ).innerHTML = `Se está eliminando el material: <b>${nombre}</b>`;
  document.getElementById("idBorrar").value = idMaterial;
  $("#modalBorrar").modal("show");
  setTimeout(function () {
    document.getElementById("borrarBtn").removeAttribute("disabled");
    document.getElementById("borrarBtn").innerHTML = "ELIMINAR";
  }, 4000);
}

const editarModal = async (id) => {
  fetch("/api/materiales/find/" + id)
    .then((res) => res.json())
    .then((material) => {
      document.getElementById("materialEdit").value = material.nombre;
	  document.getElementById("precioEdit").value = material.precio;
      document.getElementById("rubroEdit").value = material.rubro;
      document.getElementById("stockEdit").value = material.stock;

    })
    .catch((err) => console.error(err));
  $("#modalEdit").modal("show");
  document.getElementById("materialIdEdit").value = id;
};
const editarMaterial = async () => {
  $("#modalEdit").modal("hide");
  const materialEditJSON = {
    nombre: document.getElementById("materialEdit").value,
	precio: document.getElementById("precioEdit").value,
    rubro: document.getElementById("rubroEdit").value,
    stock: document.getElementById("stockEdit").value,

  };
  await fetch(
    "/api/materiales/edit/" + document.getElementById("materialIdEdit").value,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(materialEditJSON),
    }
  );
  uploadTable();
};

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
