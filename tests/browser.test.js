import browser from '../src/browser';
import test from 'blue-tape';

test('browser tests', (assert) => {
  assert.ok(browser, 'Unable to load `src/browser.js`');

  assert.end();
});

test.onFinish(() => {
  console.log(`finished testing stuffs`);
});
