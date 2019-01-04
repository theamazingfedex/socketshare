#!/usr/bin/env node

import cluster from 'cluster';
import * as tiny from 'tinyurl';
import parseArgs from 'minimist';
import clipboard from 'copy-paste';
import browser from './browser.js';

const externalip = require('external-ip')();
const argOpts = {};

let argv = parseArgs(process.argv, argOpts);
let port = argv.port || 3000;
let dir = argv.dir || '.';
let help = argv.help;

if (!!help) {
  console.log(`--help: display this prompt.
              --port: change the default port.
              --dir: use a directory besides the current directory.`);
}
else {
  externalip((err, ip) => {
    if (err) {
      console.error(`ERROR: Unable to connect to externalip service. Check your connection and try again.`, err);
      return;
    }
    let local = `http://${ip}:${port}`;

    tiny.shorten(local, (shortUrl, err) => {
      clipboard.copy(shortUrl);
      if (cluster.isMaster) {
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

    browser(port, dir);
  });

}