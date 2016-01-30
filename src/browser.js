import cluster from 'cluster'
import express from 'express';
import path from 'path';
import contentDisposition from 'content-disposition';
import scan from './scan';

const numCpus = require('os').cpus().length;

export default function(port, dir) {
  if (cluster.isMaster) {
    for (let i = 0; i < numCpus; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} has died`);
    });
  }
  else {
    const pid = cluster.worker.process.pid;
    const name = cluster.worker.id;
    console.log(`Starting worker '${name}' with PID: ${pid}`)

    let tree = scan(dir, 'files');
    let app = express();
    app.use('/', express.static(path.join(__dirname, '../public')));
    app.use('/files', express.static(process.cwd(), {
      index: false,
      setHeaders: function(res, path) {
        res.setHeader('Content-Disposition', contentDisposition(path));
      }
    }));

    app.get('/scan', function(req, res) {
      res.send(tree);
    });
    app.listen(port);
  }
}
