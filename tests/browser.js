import browser from '../src/browser';
import scan from '../src/scan';
import test from 'blue-tape';

let tree = scan('.', 'files');

test('scan tests', (assert) => {
  // assert.plan(3);

  let items = tree.items;
  assert.ok(tree, 'scan() broke. Check the build process and node packages.');
  assert.ok(items.length >= 1, 'scan(".", "files") should have at least one item.');

  assert.end();
});
test('browser tests', (assert) => {
  assert.ok(browser);

  assert.end();
});

test.onFinish(() => {
  console.log(`finished testing stuffs`);
});
