//indexGrpCaptionCond.js
import { render } from 'react-dom';
import './index.css';
import React, { useEffect, useRef } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Group,
  Inject,
} from '@syncfusion/ej2-react-grids';
import { dataDetails } from './dataGrpCaptionCond';

const OverView = () => {
  const grid = useRef(null);

  const groupSettings = {
    columns: ['Verified'],
    captionTemplate: "<span class='groupItems'> ${if(key)} <span class='e-icons e-check'></span> Verified - ${count} ${else} <span class='e-icons e-close'></span> Not Verified - ${count} ${/if} </span>"
  };

  const queryCellInfo = (args) => {
    if (args.column.field === 'Verified') {
      const iconClass = args.data.Verified === true ? 'e-icons e-check' : 'e-icons e-close';
      args.cell.innerHTML = `<span class="${iconClass}"></span> ${args.data.Verified === true ? 'Verified' : 'Not Verified'}`;
    }
  };

  return (
    <GridComponent
      ref={grid}
      groupSettings={groupSettings}
      dataSource={dataDetails}
      allowGrouping={true}
      queryCellInfo={queryCellInfo}
    >
      <ColumnsDirective>
        <ColumnDirective
          field="OrderID"
          headerText="Order ID"
          width="120"
          textAlign="Right"
          isPrimaryKey={true}
        />
        <ColumnDirective
          field="Freight"
          headerText="Freight"
          format="C2"
          width="120"
        />
        <ColumnDirective field="Verified" headerText="Verified" width="120" />
      </ColumnsDirective>
      <Inject services={[Group]} />
    </GridComponent>
  );
};

render(<OverView />, document.getElementById('sample'));
