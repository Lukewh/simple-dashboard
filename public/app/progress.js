  import React from 'react';
  import ReactDOM from 'react-dom';

  export default class ProgressBar extends React.Component {
    render() {
      return (
        <div className="progressBar">
          <div className="bar" style={{width: `${this.props.percentage}%`}}></div>
          <div className="value">{this.props.percentage.toFixed(1)}%</div>
        </div>
      );
    }
  }
