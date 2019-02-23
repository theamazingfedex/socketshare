import fs from 'fs';
import getPromisedZipFilePath from '../src/zip.js';
// import { getPromisedZipFilePath, shouldGenerateNewZipFile } from '../src/zip.js';
import test from 'blue-tape';
import touch from 'touch';

const testFolderPath = './tests/a-test-folder';
const fileExtension = '.zip';
const expectedZipFilePath = testFolderPath + fileExtension;

test('zip tests', (assert) => {
  assert.ok(getPromisedZipFilePath, 'Unable to load `src/zip.js`');

  if (!fs.existsSync(testFolderPath)) {
    fs.mkdirSync(testFolderPath);
    assert.ok(fs.existsSync(testFolderPath), 'Unable to create the test folder for zipping. Check installed dependencies: `fs`')
  }

  getPromisedZipFilePath(testFolderPath).then(newZipFilePath => {
    assert.ok(newZipFilePath === expectedZipFilePath, '`getPromisedZipFilePath` did not create the expected zip file.');

    assert.end();
  }).catch(error => assert.ok(false, error));

});

test('cached zip-file tests', (assert) => {
  if (!fs.existsSync(testFolderPath)) {
    fs.mkdirSync(testFolderPath);
  }
  getPromisedZipFilePath(testFolderPath).then(zipFilePath => {
    const zipLastModifiedAtTime = fs.statSync(zipFilePath).mtime;
    touch.sync(testFolderPath);
    getPromisedZipFilePath(testFolderPath).then(newZipFilePath => {
      const newZipLastModifiedAtTime = fs.statSync(newZipFilePath).mtime;

      assert.notEqual(zipLastModifiedAtTime, newZipLastModifiedAtTime, 'Updated source directory should cause zip to be re-generated.');

      assert.end();
      if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
      }
      if (fs.existsSync(testFolderPath)) {
        fs.rmdirSync(testFolderPath);
      }
    }).catch(error => assert.ok(false, error));
  }).catch(error => assert.ok(false, error));
});