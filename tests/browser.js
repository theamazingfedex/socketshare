import browser from '../src/browser';
import scan from '../src/scan';
import test from 'colored-tape';

test('scan test', function (assert) {
  assert.plan(3);
  assert.equal(1, 1, '1 should equal 1');
  assert.ok(browser, 'browser should be OK');
  assert.ok(scan, 'scan should be OK');
  // assert.end();
});
