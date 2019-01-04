import fs from 'fs';
import sevenBin from '7zip-bin';
import {add as addToZip} from 'node-7z';

module.exports = function getZipFilePath(sourceDir) {
  // check if the .zip file already exists next to the sourceDir
  const zipName = sourceDir + '.zip';
  // if the .zip file does not exist, create it next to the sourceDir and return the path to it
  if (!fs.existsSync(zipName)) {
    addToZip(zipName, sourceDir, {
      $bin: sevenBin.path7za,
      recursive: true
    });
  }
  // if the .zip file exists, return the path to the .zip file
  return zipName;
};