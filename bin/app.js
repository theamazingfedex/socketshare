#!/usr/bin/env node
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _externalip = require('externalip');

var _externalip2 = _interopRequireDefault(_externalip);

var _tinyurl = require('tinyurl');

var tiny = _interopRequireWildcard(_tinyurl);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _copyPaste = require('copy-paste');

var _copyPaste2 = _interopRequireDefault(_copyPaste);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _scan = require('./scan');

var _scan2 = _interopRequireDefault(_scan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _contentDisposition = require('content-disposition');

var _contentDisposition2 = _interopRequireDefault(_contentDisposition);

//const MAXINT = Number.MAX_SAFE_INTEGER;
var argOpts = {
	//    '-p':'port';
};

var argv = (0, _minimist2['default'])(process.argv, argOpts);
var port = argv.port || 3000;
var dir = argv.dir || '.';

(0, _externalip2['default'])(function (err, ip) {
	var local = 'http://' + ip + ':' + port;
	tiny.shorten(local, function (shortUrl, err) {
		_copyPaste2['default'].copy(shortUrl);
		console.log('.\n.\n.\nAcquired TinyUrl: ' + shortUrl + '\n' + '***Copied URL to clipboard***\n' + 'SocketShare is running on port ' + port +
		//`\nExternal IP: ${local}`+
		'!\nMake sure you open this port on your router!!!' + '\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^' + '\n---Press CTRL + C to stop the server---');
	});
});
var app = (0, _express2['default'])();
var tree = (0, _scan2['default'])(dir, 'files');
app.use('/', _express2['default']['static'](_path2['default'].join(__dirname, '../frontend')));
app.use('/files', _express2['default']['static'](process.cwd(), {
	index: false,
	setHeaders: function setHeaders(res, path) {
		res.setHeader('Content-Disposition', (0, _contentDisposition2['default'])(path));
	}
}));

app.get('/scan', function (req, res) {
	res.send(tree);
});
app.listen(port);