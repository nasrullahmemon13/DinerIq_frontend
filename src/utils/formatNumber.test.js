import assert from 'node:assert/strict';
import test from 'node:test';
import { formatNumber } from './formatNumber.js';

test('missing and invalid API metrics remain unavailable, not zero', () => {
  for (const value of [undefined, null, NaN, Infinity, -Infinity, '', '1200', {}, []]) {
    assert.equal(formatNumber(value, 'en-US'), 'Unavailable');
  }
});

test('real zero, negative values, and precision retain locale formatting', () => {
  assert.equal(formatNumber(0, 'en-US'), '0');
  assert.equal(formatNumber(12345, 'en-US'), '12,345');
  assert.equal(formatNumber(-1234.5, 'en-US', { minimumFractionDigits: 2 }), '-1,234.50');
});
