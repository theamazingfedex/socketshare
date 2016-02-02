#!/usr/bin/env node

import cluster from 'cluster';
import externalip from 'externalip';
import * as tiny from 'tinyurl';
import parseArgs from 'minimist';
import clipboard from 'copy-paste';
import browser from './browser.js';

const argOpts = {};
const argv = parseArgs(process.argv, argOpts);

const port = argv.port || 3000;
const dir = argv.dir || '.';
const help = argv.help || false;
const doCluster = argv.cluster || false;

if (!!help) {
  console.log(`  --help      : display this prompt.
  --port <80> : change the default port.
  --dir <path>: use a directory besides the current directory.
  --cluster   : use cluster for multi-core systems. (best if sharing to multiple friends)`);
}
else {
  externalip((err, ip) => {
    if (err) {
      console.error(`ERROR: Unable to connect to externalip service. Check your connection and try again.`, err);
      return;
    }
    const local = `http://${ip}:${port}`;

    tiny.shorten(local, (shortUrl, err) => {
      clipboard.copy(shortUrl);
      if (cluster.isMaster || !doCluster) {
        console.log(
          '.\n.\n.\nAcquired TinyUrl: ' + shortUrl + '\n' +
          '***Copied URL to clipboard***\n' +
          'SocketShare is running on port ' + port +
          '!\nMake sure you open this port on your router!!!' +
          '\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^' +
          '\n---Press CTRL + C to stop the server---'
        );
      }
    });

    browser(port, dir, !!doCluster);
  });

}