#!/usr/bin/env node

import externalip from 'externalip';
import * as tiny from 'tinyurl';
import parseArgs from 'minimist';
import clipboard from 'copy-paste';
import browser from './browser.js';

const argOpts = {};

let argv = parseArgs(process.argv,argOpts);
let port = argv.port || 3000;
let dir = argv.dir || '.';
let help = argv.help;

if (!!help) {
  console.log(`--help: display this prompt.
              --port: change the default port.
              --dir: use a directory besides the current directory.`);
}
else {
  externalip((err,ip) => {
    let local = `http://${ip}:${port}`;

    tiny.shorten(local, (shortUrl, err) => {
      clipboard.copy(shortUrl);
      console.log(
        '.\n.\n.\nAcquired TinyUrl: ' + shortUrl + '\n' +
        '***Copied URL to clipboard***\n' +
        'SocketShare is running on port ' + port +
        '!\nMake sure you open this port on your router!!!' +
        '\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^' +
        '\n---Press CTRL + C to stop the server---'
      );
    });
  });

  browser(port, dir);
}
