// indexSpinner.js
import React, { useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Sort, Inject } from '@syncfusion/ej2-react-grids';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-react-popups';
import axios from 'axios';
import './index.css';

const OrderService = {
  BASE_URL: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders/',

  execute(state) {
    return this.getData(state);
  },

  getData(state) {
    const { skip, take, sorted } = state;
    const pageQuery = `$skip=${skip}&$top=${take}`;
    const sortQuery = sorted && sorted.length ? `&$orderby=` + sorted.map(obj => `${obj.name} ${obj.direction === "ascending" ? "asc" : "desc"}`).join(',') : '';
    const url = `${this.BASE_URL}?${pageQuery}${sortQuery}&$count=true&$format=json`;

    return axios.get(url)
      .then(response => {
        const data = response.data;
        return { result: data['value'], count: parseInt(data['@odata.count'], 10) };
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        return { result: [], count: 0 };
      });
  }
};

const CustomBinding = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const state = { skip: 0, take: 150 };
    dataStateChange(state);
  }, []);

  const created = () => {
    const spinnerTarget = document.querySelector('#customSpinner');
    createSpinner({ target: spinnerTarget, width: '20px' });
  };

  const dataStateChange = (state) => {
    const spinnerTarget = document.querySelector('#customSpinner');

    // Show the spinner before fetching data
    

    // Add a conditional check for spinnerTarget
    if (spinnerTarget) {
      OrderService.execute(state)
        .then(gridData => {
          console.log('Initial Data received:', gridData);
          // Check if the sorting information is correctly applied
        const sortInfo = state.sorted;
        console.log('Sorting Information:', sortInfo);

        // Check if the sorting information is passed to the OData service correctly
        const urlWithSort = OrderService.BASE_URL + `?$skip=${state.skip}&$top=${state.take}` +
          (sortInfo && sortInfo.length ? `&$orderby=` + sortInfo.map(obj => `${obj.name} ${obj.direction === "ascending" ? "asc" : "desc"}`).join(',') : '');

        console.log('URL with Sorting:', urlWithSort);
          gridRef.current.dataSource = gridData;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        })
        .finally(() => {
          showSpinner(spinnerTarget);
          setTimeout(() => {
            hideSpinner(spinnerTarget); // Hide the spinner regardless of success or failure
          }, 1000);
        });
    } else {
      console.error('Spinner target not found');
    }
  };

  return (
    <div className='control-pane'>
      <div id='customSpinner'></div>
      <div className='control-section'>
        <GridComponent
          dataSource={[]}
          ref={gridRef}
          allowPaging={true}
          allowSorting={true}
          pageSettings={{ pageCount: 4, pageSize: 150 }}
          height='400'
          created={created}
          allowGrouping={true}
          dataStateChange={dataStateChange}
        >
          <ColumnsDirective>
            <ColumnDirective field='OrderID' headerText='Order ID' width='120'></ColumnDirective>
            <ColumnDirective field='CustomerID' headerText='Customer Name' width='150'></ColumnDirective>
            <ColumnDirective field='ShipName' headerText='Ship Name' width='120' />
            <ColumnDirective field='ShipCity' headerText='Ship City' width='150'></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Page, Group, Sort]} />
        </GridComponent>
      </div>
    </div>
  );
};

render(<CustomBinding />, document.getElementById('sample'));
