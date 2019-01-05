import fs from 'fs';
import cluster from 'cluster'
import express from 'express';
import path from 'path';
import contentDisposition from 'content-disposition';
import onFinished from 'on-finished';
import destroy from 'destroy';
import scan from './scan';
import getPromisedZipFilePath from './zip';

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

    app.get('/zips/:folderpath', function(req, res) {
      let folderPath = './' + req.params.folderpath.split('.')[0];
      getPromisedZipFilePath(folderPath).then((zipPath) => {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', contentDisposition(zipPath));
        res.attachment(zipPath);

        let responseStream = fs.createReadStream(zipPath);
        responseStream.pipe(res);
        onFinished(res, () => {
          destroy(responseStream);
          res.status(200).end();
        });
      });
    });

    app.get('/scan', function(req, res) {
      res.send(tree);
    });
    app.listen(port);
  }
}
