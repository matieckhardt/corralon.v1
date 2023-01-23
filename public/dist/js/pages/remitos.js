const remitoId = document.getElementById('remitoId').value;
window.onload = (event) => {
  uploadTable();
};

async function manejarEmitido(elem) {
  console.log(elem.dataset.id, elem.checked);
  await fetch('/api/remitos/edit/' + elem.dataset.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ emitido: elem.checked }),
  }).catch(() => console.log('Hubo un error en el put'));
}

const uploadTable = () => {
  fetch('/api/remitos/get/' + remitoId)
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      let idRemito = arrayConObjetos._id;
      let arrayEdit = arrayConObjetos.listaRemitos.map((remito, index) => {
        remito['posicion'] = index;
        remito['_id'] = idRemito;
        return remito;
      });
      console.log(arrayEdit);
      $('#tablaRemitos').DataTable().clear().destroy();
      $('#tablaRemitos').DataTable({
        pageLength: 25,
        data: arrayEdit,
        order: [[0, 'desc']],
        columns: [
          {
            data: 'fechaComp',
            data: function (data, type, row) {
              if (data.fechaComp) {
                return `${data.fechaComp}`;
              } else {
                return `-`;
              }
            },
          },
          {
            data: 'bultos',
            data: function (data, type, row) {
              if (data.bultos) {
                return `${data.bultos}`;
              } else {
                return `-`;
              }
            },
          },
          {
            data: 'posicion',
            data: '_id',
            data: function (data, type, row) {
              return `
              <a href="/api/remitos/find/${data._id}/${data.posicion}" class="btn btn-sm btn-warning" target="_blank">Ver Remito<i class="pl-2 fa fa-edit" ></i></a>
              `;
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
    'modalDel'
  ).innerHTML = `Se está eliminando el cliente: <b>${nombre}</b>`;
  document.getElementById('idBorrar').value = idMaterial;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 4000);
}

const eliminarMaterial = () => {
  let id = document.getElementById('idBorrar').value;
  fetch(`/api/materiales/delete/${id}`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(() => uploadTable())
    .catch((err) => console.log(err));
};
