import fs from 'fs';
import sevenBin from '7zip-bin';
import {add as addToZip} from 'node-7z';
import destroy from 'destroy';

module.exports = function getPromisedZipFilePath(sourceDir) {
  return new Promise((resolve, reject) => {
    // check if the .zip file already exists next to the sourceDir
    const zipName = sourceDir + '.zip';
    // if the .zip file does not exist, create it next to the sourceDir and return the path to it
    if (shouldGenerateNewZipFile(sourceDir)) {
      console.log(`Generating zip-file from: ${sourceDir}`);
      if (fs.existsSync(zipName)) {
        fs.unlinkSync(zipName);
      }
      const zipStream = addToZip(zipName, sourceDir, {
        $bin: sevenBin.path7za,
        recursive: true
      });
      zipStream.on('end', () => {
        console.log(`Zip-file generation complete.`);
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

export function shouldGenerateNewZipFile(filePath) {
  var zipPath = filePath + '.zip';
  var zipExists = fs.existsSync(zipPath);

  if (!zipExists) {
    return true;
  }
  else {
    var folderLastModifiedAtTime = fs.statSync(filePath).mtime;
    var zipLastModifiedAtTime = fs.statSync(zipPath).mtime;
    return (folderLastModifiedAtTime - zipLastModifiedAtTime) > 0
  }
}