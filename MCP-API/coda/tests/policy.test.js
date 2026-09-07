import test from 'node:test';
import assert from 'node:assert/strict';
import { assertAllowed, Risk } from '../src/policy.js';
const write={name:'coda.row.update',risk:Risk.WRITE};
const high={name:'coda.button.push',risk:Risk.HIGH_RISK};

test('read/write/high-risk policy gates correctly', () => {
  assert.doesNotThrow(()=>assertAllowed({name:'read',risk:Risk.READ},{},{allowWrites:false}));
  assert.throws(()=>assertAllowed(write,{approvalToken:'abcdefghijklmnop'},{allowWrites:false}),/disabled/);
  assert.throws(()=>assertAllowed(write,{approvalToken:'wrongwrongwrong!!'},{allowWrites:true,approvalToken:'abcdefghijklmnop'}),/approval/);
  assert.doesNotThrow(()=>assertAllowed(write,{approvalToken:'abcdefghijklmnop'},{allowWrites:true,approvalToken:'abcdefghijklmnop'}));
  assert.throws(()=>assertAllowed(high,{approvalToken:'abcdefghijklmnop'},{allowWrites:true,allowHighRisk:false,approvalToken:'abcdefghijklmnop'}),/high risk/);
});
