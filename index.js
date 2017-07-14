const express = require('express');
const systats = require('systats');
const diskspace = require('diskspace');
const bodyParser = require('body-parser');
const git = require('simple-git')('/home/luke/juju-gui');
const app = express();
const WebSocket = require('ws');
const http = require('http');

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/data', (req, res) => {
  diskspace.check('/', (err, rootDiskResult) => {
    diskspace.check('/home', (err, homeDiskResult) => {
      systats(function (result) {
        function add(a, b) {
          return a + b;
        }
        let cpu = result.cpu.reduce(add, 0);
        cpu = cpu / result.cpu.length;
        data = {
          time: new Date().getTime(),
          cpu: cpu,
          disks: {
            '/': ((rootDiskResult.used / rootDiskResult.total) * 100).toFixed(1),
            '/home': ((homeDiskResult.used / homeDiskResult.total) * 100).toFixed(1)
          },
          ram: ((result.memory.total - result.memory.free) / result.memory.total) * 100
        }
        res.status(200).json(data);
      });
    });
  });
  // nodestat.read(function (result) {
  //   function add(a, b) {
  //     return a + b;
  //   }
  //   let cpu = result.cpu.reduce(add, 0);
  //   data = true;
  //   resolve(result);
  //   // let cpu = result.cpu.reduce((a, b) => {return a+b;}, 0);
  //   // cpu = cpu / result.cpu.length;
  //   // const stats = {
  //   //   time: new Date().getTime(),
  //   //   cpu: 100 - cpu,
  //   //   load: data.load,
  //   //   disk: data.disk.total.usage
  //   // };
  //   // data = stats;
  //   // resolve(stats);
  // });
});

app.post('/switchRepo', (req, res) => {
  const user = req.body.repo.split(':')[0];
  const branch = req.body.repo.split(':')[1];
  git.fetch(user, branch).checkout(`${user}/${branch}`, (err, result) => {
    if (err) {
      res.status(500).json({message: err});
      return;
    }
    res.status(200).json(result);
  });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', ws => {
  const location = ws.upgradeReq.url;

  ws.on('meesage', message => {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
