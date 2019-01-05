import fs from 'fs';
import sevenBin from '7zip-bin';
import {add as addToZip} from 'node-7z';
import destroy from 'destroy';

module.exports = function getPromisedZipFilePath(sourceDir) {
  return new Promise((resolve, reject) => {
    // check if the .zip file already exists next to the sourceDir
    const zipName = sourceDir + '.zip';
    // if the .zip file does not exist, create it next to the sourceDir and return the path to it
    if (!fs.existsSync(zipName)) {
      const zipStream = addToZip(zipName, sourceDir, {
        $bin: sevenBin.path7za,
        recursive: true
      });
      zipStream.on('end', () => {
        destroy(zipStream);
        resolve(zipName);
      });
      zipStream.on('error', reject);
    }
    else {
      resolve(zipName);
    }
  });
};