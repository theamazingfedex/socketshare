import express from 'express';
import path from 'path';
import contentDisposition from 'content-disposition';
import scan from './scan';

export default function(port, dir){
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
  app.listen(port);
}
