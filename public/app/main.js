import React from 'react';
import ReactDOM from 'react-dom';

import CPUView from './cpu';
import RAMView from './ram';
import DiskView from './disk';
import SwitchRepo from './switch-repo';

const COLOUR = {
  ERROR: '#c7162b',
  WARN: '#f99b11',
  INFORMATION: '#007aa6'
};

const THRESHOLD = {
  INFORMATION: 60,
  WARN: 80,
  ERROR: 90
};

class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cpu: {
        labels: [],
        datasets: [{
          fillColor: COLOUR.INFORMATION,
          data: []
        }],
        steppedLine: false
      },
      ram: {
        labels: [],
        datasets: [{
          fillColor: COLOUR.INFORMATION,
          data: []
        }],
        steppedLine: false
      },
      disks: {
        '/': {
          labels: [],
          datasets: [{
            fillColor: COLOUR.INFORMATION,
            data: []
          }],
          steppedLine: false
        },
        '/home': {
          labels: [],
          datasets: [{
            fillColor: COLOUR.INFORMATION,
            data: []
          }],
          steppedLine: false
        }
      }
    };
  }

  componentDidMount() {
    this.update();
  }

  update() {
    fetch('/data').then(response => {
      return response.json();
    }).then(data => {
      let cpu = mainView.state.cpu;
      cpu.labels.push(data.time);
      cpu.datasets[0].data.push(data.cpu);

      if (cpu.labels.length > 300) {
        cpu.labels.splice(0, 1);
        cpu.datasets[0].data.splice(0, 1);
      }

      let ram = mainView.state.ram;
      ram.labels.push(data.time);
      ram.datasets[0].data.push(data.ram);

      if (ram.labels.length > 300) {
        ram.labels.splice(0, 1);
        ram.datasets[0].data.splice(0, 1);
      }

      let disks = mainView.state.disks;

      disks['/'].labels.push(data.time);
      disks['/'].datasets[0].data.push(data.disks['/']);

      if (disks['/'].labels.length > 300) {
        disks['/'].labels.splice(0, 1);
        disks['/'].datasets[0].data.splice(0, 1);
      }

      disks['/home'].labels.push(data.time);
      disks['/home'].datasets[0].data.push(data.disks['/home']);

      if (disks['/home'].labels.length > 300) {
        disks['/home'].labels.splice(0, 1);
        disks['/home'].datasets[0].data.splice(0, 1);
      }

      cpu.datasets[0].fillColor = COLOUR.INFORMATION;
      if (data.cpu > THRESHOLD.WARN) {
        cpu.datasets[0].fillColor = COLOUR.WARN;
      }
      if (data.cpu > THRESHOLD.ERROR) {
        cpu.datasets[0].fillColor = COLOUR.ERROR;
      }

      ram.datasets[0].fillColor = COLOUR.INFORMATION;
      if (data.ram > THRESHOLD.WARN) {
        ram.datasets[0].fillColor = COLOUR.WARN;
      }
      if (data.ram > THRESHOLD.ERROR) {
        ram.datasets[0].fillColor = COLOUR.ERROR;
      }

      disks['/'].datasets[0].fillColor = COLOUR.INFORMATION;
      if (data.disks['/'] > THRESHOLD.WARN) {
        disks['/'].datasets[0].fillColor = COLOUR.WARN;
      }
      if (data.disks['/'] > THRESHOLD.ERROR) {
        disks['/'].datasets[0].fillColor = COLOUR.ERROR;
      }

      disks['/home'].datasets[0].fillColor = COLOUR.INFORMATION;
      if (data.disks['/home'] > THRESHOLD.WARN) {
        disks['/home'].datasets[0].fillColor = COLOUR.WARN;
      }
      if (data.disks['/home'] > THRESHOLD.ERROR) {
        disks['/home'].datasets[0].fillColor = COLOUR.ERROR;
      }

      const state = {
        cpu: cpu,
        disks: disks,
        ram: ram
      };

      this.setState(state);
      setTimeout(this.update.bind(this), 30000);
     });
  }

  render() {
    return (
      <div>
        <SwitchRepo />
        <CPUView data={this.state.cpu} />
        <RAMView data={this.state.ram} />
        <DiskView title="/" data={this.state.disks['/']} />
        <DiskView title="/home" data={this.state.disks['/home']} />
      </div>
    );
  }
}

const mainView = ReactDOM.render(<MainView />, document.body.querySelector('.main'));
