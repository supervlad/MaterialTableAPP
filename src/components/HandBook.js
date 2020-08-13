import React from 'react';
import MaterialTable from 'material-table';
import { useParams } from "react-router-dom";

export function HandBook() {

const { itemId } = useParams();

const [state, setValue] = React.useState({
  columns: [
    { title: 'ItemId', field: 'iteM_KEY', editable: 'onAdd' },
    { title: 'Value', field: 'iteM_VALUE' }
  ],
  data: []
});

  React.useEffect(() => {
    const getData = async () => {
      await fetch("http://localhost/Swagger/api/handbook/" + itemId)
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

  return (
    <MaterialTable
      title="Editable Example"
      columns={state.columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            newData.lisT_ID = itemId;
            fetch("http://localhost/Swagger/api/handbook/", {
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
            fetch("http://localhost/Swagger/api/handbook/", {
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
            fetch("http://localhost/Swagger/api/handbook/" + oldData.iteM_KEY, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'text/html;charset=utf-8'
              },
              body: JSON.stringify(oldData.iteM_KEY)
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
