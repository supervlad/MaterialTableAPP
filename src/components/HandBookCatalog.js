import React from 'react';
import MaterialTable from 'material-table';
import { useHistory } from "react-router-dom";

export function HandBookCatalog() {

const [state, setValue] = React.useState({
  columns: [
    { title: 'TaskId', field: 'tasK_ID' },
    { title: 'Name', field: 'lisT_NAME' },
    { title: 'Description', field: 'lisT_DESCRIPTION' }
  ],
  data: []
});

  React.useEffect(() => {
    const getData = async () => {
      await fetch("http://localhost/Swagger/api/handbookcatalog")
      .then(res => res.json())
      .then(
        (result) => {
          console.log('getData resolve', result);
          setValue({...state, data: result});
        },
        (error) => {
          console.log('getData error');
        }
      );
    };
    getData();
  }, []);

  let history = useHistory();

  return (

    <MaterialTable
      title="Editable Example"
      onRowClick = {(event, rowData) => history.push(`/api/handbook/${rowData.lisT_ID}`)}
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            fetch("http://localhost/Swagger/api/handbookcatalog", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(newData)
            })
            .then(res => res.json())
            .then(
              (result) => {
                resolve();
                console.log('RowAdd resolve', result);

                if (result.status &&
                  (result.status != 200 || result.status != 204)) {
                  alert('Ошибка сервера! Повторите попытку добавления данных!');
                  return;
                }

                setValue((prevState) => {
                  const data = [...prevState.data];
                  data.push(result);
                  return { ...prevState, data };
                });
              },
              (error) => {
                console.log('RowAdd error');
              }
            ); 
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            fetch("http://localhost/Swagger/api/handbookcatalog", {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(newData)
            })
            .then(res => res.json())
            .then(
              (result) => {
                resolve();
                console.log('RowUpdate resolve', result);

                if (result.status &&
                  (result.status != 200 || result.status != 204)) {
                  alert('Ошибка сервера! Повторите попытку изменения данных!');
                  return;
                }

                if (oldData) {
                  setValue((prevState) => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = result;
                    return { ...prevState, data };
                  });
                }
              },
              (error) => {
                console.log('RowUpdate error');
              }
            );
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            fetch("http://localhost/Swagger/api/handbookcatalog/" + oldData.lisT_ID, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'text/html;charset=utf-8'
              },
              body: JSON.stringify(oldData.lisT_ID)
            })
            .then(res => res.json())
            .then(
              (result) => {
                resolve();
                console.log('RowDelete resolve', result);

                if (result.status &&
                  (result.status != 200 || result.status != 204)) {
                  alert('Ошибка сервера! Повторите попытку удаления данных!');
                  return;
                }

                setValue((prevState) => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(result), 1);
                  return { ...prevState, data };
                });
              },
              (error) => {
                console.log('RowDelete error');
              }
            );
          }),
      }}
    />
  );
}
