import { render } from 'react-dom';
import './index.css';
import { getValue } from '@syncfusion/ej2-base';
import * as React from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Inject } from '@syncfusion/ej2-react-grids';
import { data } from './data';
import { SampleBase } from './sample-base';
import './index.css';
export class Localbinding extends SampleBase {
  rowDataBound(args) {
      if (args.row) {
        if (getValue('Freight', args.data) < 30){
          args.row.classList.add('below-30');
        } else if(getValue('Freight', args.data) < 80 ) {
            args.row.classList.add('below-80');
        } else {
            args.row.classList.add('above-80');
        }
      }
  }
    render() {
        return (<div className='control-pane'>
                <div className='control-section'>
                    <GridComponent dataSource={data} allowPaging={true} rowDataBound={this.rowDataBound} pageSettings={{ pageCount: 5 }} >
                        <ColumnsDirective>
                            <ColumnDirective field='OrderID' headerText='Order ID' width='120' textAlign='Right'></ColumnDirective>
                            <ColumnDirective field='CustomerName' headerText='Customer Name' width='150'></ColumnDirective>
                            <ColumnDirective field='OrderDate' headerText='Order Date' width='130' format='yMd' textAlign='Right'/>
                            <ColumnDirective field='Freight' headerText='Freight' width='120' format='C2' textAlign='Right'/>
                            <ColumnDirective field='ShippedDate' headerText='Shipped Date' width='130' format='yMd' textAlign='Right'></ColumnDirective>
                            <ColumnDirective field='ShipCountry' headerText='Ship Country' width='150'></ColumnDirective>
                        </ColumnsDirective>
                        <Inject services={[Page]}/>
                    </GridComponent>
                </div>
            </div>);
    }
}

render(<Localbinding />, document.getElementById('sample'));