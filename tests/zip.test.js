import fs from 'fs';
import getZipFilePath from '../src/zip.js';
import test from 'blue-tape';

const testFolderPath = './tests/a-test-folder';
const fileExtension = '.zip';
const expectedZipFilePath = testFolderPath + fileExtension;

test('zip tests', (assert) => {
  assert.ok(getZipFilePath, 'Unable to load `src/zip.js`');

  if (!fs.existsSync(testFolderPath)) {
    fs.mkdirSync(testFolderPath);
    assert.ok(fs.existsSync(testFolderPath), 'Unable to create the test folder for zipping. Check installed dependencies: `fs`')
  }

  getZipFilePath(testFolderPath).then(zipFilePath => {
    assert.ok(zipFilePath === expectedZipFilePath, '`getZipFilePath` did not match the expected path.');

    fs.unlinkSync(zipFilePath);
    assert.notOk(fs.existsSync(zipFilePath), 'failed to remove the existing zipfile. Check installed dependencies: `fs`');
  });


  getZipFilePath(testFolderPath).then(newZipFilePath => {
    assert.ok(newZipFilePath === expectedZipFilePath, '`getZipFilePath` did not create the expected zip file.');

    assert.end();
  });
});
