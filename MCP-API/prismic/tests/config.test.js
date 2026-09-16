import test from 'node:test';import assert from 'node:assert/strict';import {loadConfig} from '../src/config.js';
test('requires repository',()=>assert.throws(()=>loadConfig({}),/required/));
test('loads least-secret configuration',()=>assert.deepEqual(loadConfig({PRISMIC_REPOSITORY_NAME:'demo'}),{repositoryName:'demo',accessToken:undefined,timeoutMs:10000,maxRetries:2}));
test('bounds reliability controls',()=>assert.throws(()=>loadConfig({PRISMIC_REPOSITORY_NAME:'demo',PRISMIC_MAX_RETRIES:'99'}),/integer/));
