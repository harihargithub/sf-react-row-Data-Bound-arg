import React, { useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Sort, Inject } from '@syncfusion/ej2-react-grids';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-react-popups';
import axios from 'axios';
import './index.css';

const OrderService = {
  BASE_URL: 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders',

  execute(state) {
    return this.getData(state);
  },

  getData(state) {
    const { skip, take, sorted } = state;
    const pageQuery = `$skip=${skip}&$top=${take}`;
    const sortQuery = sorted && sorted.length ? `&$orderby=` + sorted.map(obj => `${obj.name} ${obj.direction}`).join(',') : '';
    const url = `${this.BASE_URL}?${pageQuery}${sortQuery}&$inlinecount=allpages&$format=json`;

    return axios.get(url)
      .then(response => {
        const data = response.data;
        return { result: data['d']['results'], count: parseInt(data['d']['__count'], 10) };
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

    showSpinner(spinnerTarget); // Show the spinner before fetching data

    OrderService.execute(state)
      .then(gridData => {
        console.log('Data received:', gridData);
        gridRef.current.dataSource = gridData;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        hideSpinner(spinnerTarget); // Hide the spinner regardless of success or failure
      });
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
