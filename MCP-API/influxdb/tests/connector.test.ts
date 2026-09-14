import assert from 'node:assert/strict';
import test from 'node:test';
import { loadConfig } from '../src/config.js';
import { approvalDigest, assertApproval } from '../src/policy.js';
import { ALLOWED_UPSTREAM_TOOLS } from '../src/upstream.js';

test('loads a least-privilege connector configuration', () => {
  const config = loadConfig({
    INFLUX_DB_INSTANCE_URL: 'http://localhost:8181/',
    INFLUX_DB_TOKEN: 'test-token',
    INFLUX_DB_PRODUCT_TYPE: 'core',
    INFLUX_CONNECTOR_TIMEOUT_MS: '5000'
  });
  assert.equal(config.productType, 'core');
  assert.equal(config.timeoutMs, 5000);
});

test('rejects invalid product type and missing token', () => {
  assert.throws(() => loadConfig({ INFLUX_DB_INSTANCE_URL: 'http://localhost:8181/', INFLUX_DB_PRODUCT_TYPE: 'bad' }));
});

test('approval is deterministic and required for write tools', () => {
  const id = approvalDigest('influxdb.data.write', 'secret');
  assert.doesNotThrow(() => assertApproval('influxdb.data.write', id, 'secret'));
  assert.throws(() => assertApproval('influxdb.data.write', undefined, 'secret'));
  assert.throws(() => assertApproval('influxdb.data.write', '0'.repeat(64), 'secret'));
});

test('upstream MCP surface is explicitly allowlisted', () => {
  assert(ALLOWED_UPSTREAM_TOOLS.has('query_sql'));
  assert(ALLOWED_UPSTREAM_TOOLS.has('write_line_protocol'));
  assert(!ALLOWED_UPSTREAM_TOOLS.has('create_admin_token'));
  assert(!ALLOWED_UPSTREAM_TOOLS.has('regenerate_operator_token'));
});
