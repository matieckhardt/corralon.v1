const clienteId = document.getElementById('clienteId').value;
const chequeForm = document.getElementById('chequeForm');
const numCheque = document.getElementById('NumCheque');
const fechaCheque = document.getElementById('FechaCheque');
const fechaPago = document.getElementById('fecha');
const monto = document.getElementById('monto');
const metodoDePago = document.getElementById('metodoDePago');
const observaciones = document.getElementById('observaciones');
const nroComprobante = document.getElementById('nroComprobante');
const comision = document.getElementById('comision');
const comisionNote = document.getElementById('comisionNote');
let razonSocial = '';
let hoy = new Date();
let dd = hoy.getDate();
let mm = hoy.getMonth() + 1; //January is 0!
let yyyy = hoy.getFullYear();
if (dd < 10) {
  dd = '0' + dd;
}
if (mm < 10) {
  mm = '0' + mm;
}
hoy = dd + '/' + mm + '/' + yyyy;

window.onload = (event) => {
  uploadTable();
  traerCliente();
  monto.addEventListener('input', () => {
    metodoDePago.value === 'tarjeta'
      ? (comision.value = parseFloat(monto.value * 0.07).toFixed(2))
      : (comision.value = 0);
  });
};

const traerCliente = async () => {
  await fetch('/api/clientes/findOne/' + clienteId)
    .then((response) => response.json())
    .then((data) => (razonSocial = data.RazonSocial))
    .catch((error) => console.log(error));
};

const evalCheque = (elem) => {
  elem.value === 'cheque'
    ? chequeForm.removeAttribute('hidden')
    : chequeForm.setAttribute('hidden', 'hidden');
  elem.value === 'cheque'
    ? numCheque.removeAttribute('disabled')
    : numCheque.setAttribute('disabled', 'disabled');
  elem.value === 'cheque'
    ? fechaCheque.removeAttribute('disabled')
    : fechaCheque.setAttribute('disabled', 'disabled');
  elem.value === 'tarjeta'
    ? comision.removeAttribute('hidden')
    : comision.setAttribute('hidden', 'hidden');
  elem.value === 'tarjeta'
    ? comisionNote.removeAttribute('hidden')
    : comisionNote.setAttribute('hidden', 'hidden');
  elem.value === 'tarjeta'
    ? (comision.value = parseFloat(monto.value * 0.07).toFixed(2))
    : (comision.value = 0);
};

const altaPago = async () => {
  const datosPago = {
    fecha: fechaPago.value || hoy,
    cliente: razonSocial,
    clienteId,
    comision: comision.value,
    metodoDePago: metodoDePago.value,
    nroComprobante: nroComprobante.value || 0,
    observaciones: observaciones.value,
    monto: monto.value,
  };
  if (metodoDePago.value === 'cheque') {
    datosPago['fechaCheque'] = fechaCheque.value;
    datosPago['numCheque'] = numCheque.value;
  }
  await fetch('/api/pagos/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosPago),
  })
    .then((x) => x.json())
    .then(() => uploadTable())
    .catch(() => alert('hubo un error en el alta de Pagos'));
};

const uploadTable = () => {
  fetch('/api/pagos/getPagoCliente/' + clienteId)
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      $('#tablaPagos').DataTable().clear().destroy();
      $('#tablaPagos').DataTable({
        pageLength: 25,
        data: arrayConObjetos,
        columns: [
          {
            data: 'fecha',
          },
          {
            data: 'nroComprobante',
          },
          {
            data: 'metodoDePago',
          },
          {
            data: 'observaciones',
          },
          {
            data: 'monto',
          },
          {
            data: 'comision',
          },
          {
            data: '_id',
            data: 'cliente',
            data: function (data, type, row) {
              return `<a href="/api/pagos/find/${data._id}" class="btn btn-sm btn-warning" href="#" hidden onclick="mostrarCliente('${data._id}')">Editar <i class="fa fa-edit" ></i></a>
              <a class="btn btn-sm btn-danger" href="#" onclick="preguntaBorrar('${data._id}')">Borrar <i class="far fa-trash-alt" ></i></a>`;
            },
          },
        ],
      });
      formPagos.reset();
    })
    .catch((err) => {
      console.error(err);
    });
};

function preguntaBorrar(idPagos) {
  document.getElementById('modalDel').innerHTML = `Se está eliminando el pago`;
  document.getElementById('idBorrar').value = idPagos;
  $('#modalBorrar').modal('show');
  setTimeout(function () {
    document.getElementById('borrarBtn').removeAttribute('disabled');
    document.getElementById('borrarBtn').innerHTML = 'ELIMINAR';
  }, 3000);
}

const eliminarPago = () => {
  let id = document.getElementById('idBorrar').value;
  fetch(`/api/pagos/delete/${id}`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .then(() => uploadTable())
    .catch((err) => console.log(err));
};
