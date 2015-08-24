#!/usr/bin/env node

import externalip from 'externalip';
import * as tiny from 'tinyurl';
import parseArgs from 'minimist';
import clipboard from 'copy-paste';
import express from 'express';
import scan from './scan';
import path from 'path';
import contentDisposition from 'content-disposition';

//const MAXINT = Number.MAX_SAFE_INTEGER;
const argOpts = {
    //    '-p':'port';
};

let argv = parseArgs(process.argv,argOpts);
let port = argv.port || 3000;
let dir = argv.dir || '.';


externalip((err,ip) => {
    let local = `http://${ip}:${port}`;
    tiny.shorten(local, (shortUrl, err) => {
	clipboard.copy(shortUrl);
	console.log(
	    '.\n.\n.\nAcquired TinyUrl: ' + shortUrl + '\n' +
		'***Copied URL to clipboard***\n' +
		'SocketShare is running on port ' + port +
		//`\nExternal IP: ${local}`+
		'!\nMake sure you open this port on your router!!!' +
		'\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^' +
		'\n---Press CTRL + C to stop the server---');
    });
});
let tree = scan(dir, 'files');
let app = express();
app.use('/', express.static(path.join(__dirname, 'frontend')));
app.use('/files', express.static(process.cwd(), {
	index: false,
	setHeaders: function(res, path){
	    res.setHeader('Content-Disposition', contentDisposition(path));
	}
}));

app.get('/scan', function(req,res){
	res.send(tree);
});
app.listen(port);
