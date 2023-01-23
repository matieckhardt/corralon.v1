window.onload = (event) => {
  uploadTable();
};

const uploadTable = () => {
  fetch("/api/resultados/json")
    .then((response) => response.json())
    .then((arrayConObjetos) => {
      console.log(arrayConObjetos);
      $("#tablaMateriales").DataTable().clear().destroy();
      $("#tablaMateriales").DataTable({
        pageLength: 25,
        data: arrayConObjetos,
        columns: [
          {
            data: "Saldo Inicial",
          },
          {
            data: "ventas",
          },
          {
            data: "boni",
          },
          {
            data: "productivos",
          },
          {
            data: "Total Variable",
          },
          {
            data: "noProductivos",
          },
          {
            data: "Total",
          },
        ],
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
