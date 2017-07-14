import React from 'react';
import ReactDOM from 'react-dom';
import {Line} from 'react-chartjs';

export default class RAMView extends React.Component {
  render() {
    let data = this.props.data;
    if (data.labels.length > 0) {
      return (<div>
        <h1>RAM</h1>
        <Line data={data} width="1000" height="500"/>
      </div>);
    }
    return (<div><h1>RAM</h1></div>);
  }
}
