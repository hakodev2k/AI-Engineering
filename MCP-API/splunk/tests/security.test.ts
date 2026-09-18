import {afterEach,describe,expect,it} from 'vitest';
import {assertSafeQuery,requireSavedSearchApproval,UPSTREAM} from '../src/index.js';

describe('Splunk connector safety',()=>{
  afterEach(()=>delete process.env.SPLUNK_ALLOW_EXECUTE_SAVED_SEARCH);
  it('allows read-only SPL',()=>expect(()=>assertSafeQuery('search index=main error | stats count by host')).not.toThrow());
  it.each(['search index=main | delete','index=main | collect index=archive','| outputlookup users.csv','| sendemail to=a@example.com'])('blocks risky SPL: %s',q=>expect(()=>assertSafeQuery(q)).toThrow(/state-changing/));
  it('requires operator approval for saved-search execution',()=>expect(()=>requireSavedSearchApproval()).toThrow(/approval required/));
  it('accepts operator approval',()=>{process.env.SPLUNK_ALLOW_EXECUTE_SAVED_SEARCH='true';expect(()=>requireSavedSearchApproval()).not.toThrow();});
  it('uses a fixed upstream allowlist',()=>{expect(UPSTREAM.has('splunk_run_query')).toBe(true);expect(UPSTREAM.has('execute_any_api_request')).toBe(false);});
});
