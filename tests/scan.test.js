import scan from '../src/scan';
import test from 'blue-tape';

let tree = scan('.', 'files');
test('scan tests', (assert) => {
  // assert.plan(3);
  assert.ok(scan, 'Unable to load `src/scan.js`');

  let items = tree.items;
  assert.ok(tree, 'scan() broke. Check the build process and node packages.');
  assert.ok(items.length >= 1, 'scan(".", "files") should have at least one item.');

  assert.end();
});
