import express from 'express';
import path from 'path';
import mime from 'mime';
import fs from 'fs';
import contentDisposition from 'content-disposition';
import scan from './scan';
var EasyZip = require('easy-zip').EasyZip;

export default function(port = 3000, dir = '.'){
  let tree = scan(dir, 'files');
  let app = express();
  app.use('/', express.static(path.join(__dirname, '../public')));
  app.use('/files', express.static(process.cwd(), {
    index: false,
    setHeaders: function(res, path){
      res.setHeader('Content-Disposition', contentDisposition(path));
    }
  }));

  app.get('/scan', function(req,res){
    res.send(tree);
  });
  app.get('/zipped', function(req, res){
    console.log(`current url ::: ${req.url}`);
    var zip5 = new EasyZip();
    zip5.zipFolder('../easy-zip',function(){
      zip5.writeToFile('folderall.zip');
    });
    var file = __dirname + req.body.file;
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);
    var filestream = fs.createReadStream(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    filestream.pipe(res);
  });
  app.listen(port);
}
