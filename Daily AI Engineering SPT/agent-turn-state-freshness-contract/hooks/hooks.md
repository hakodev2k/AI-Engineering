# Hooks

## Hook 1 — Pre-Turn Admission
**Trigger:** new user input accepted for a persisted thread.  
**Action:** generate `turn_id`, load latest durable revision, set `active_turn_id`, invalidate configured terminal fields.  
**Command:** adapter-specific call to `turn_state_guard.py init` or equivalent middleware.  
**Expected result:** no authoritative terminal field remains from a prior turn.  
**Failure behavior:** fail closed before model/tool execution.

## Hook 2 — Post-Tool Evidence Stamp
**Trigger:** tool/test/approval/artifact result is persisted.  
**Action:** stamp result with `owner_turn_id` and state revision.  
**Expected result:** evidence ownership is machine-verifiable.  
**Failure behavior:** retain raw result for diagnostics but do not let it satisfy current-turn finalization.

## Hook 3 — Pre-Finalization Freshness Gate
**Trigger:** any route to END, structured-result return, or user-visible final response.  
**Action:** run `python scripts/turn_state_guard.py validate-state --state <state.json> --policy config/turn-state-policy.json`.  
**Expected result:** exit 0 and JSON `{ "valid": true }`.  
**Failure behavior:** reload latest durable state once; if still invalid, stop with `state_freshness_error`.

## Hook 4 — Retry Snapshot Refresh
**Trigger:** stream/tool/transport error leading to retry.  
**Action:** reconcile in-flight completed work, persist it, then reconstruct retry input from the newest durable revision.  
**Expected result:** retry revision is not older than any completed current-turn evidence.  
**Failure behavior:** stop; do not reuse a pre-loop cached prompt/state snapshot.

## Hook 5 — Event Replay Correlation
**Trigger:** hydrated thread begins streaming historical + live events.  
**Action:** require run/turn correlation before an event can mutate current-run UI state or count as verification evidence.  
**Expected result:** unmatched replay events remain historical/non-authoritative.  
**Failure behavior:** quarantine uncorrelated events and surface correlation error.

## Hook 6 — CI Regression Gate
**Trigger:** changes to state schema, reducers, retry/replay, finalizer, structured output, checkpoint code, or event lifecycle.  
**Action:** run `python -m unittest tests/test_turn_state_guard.py -v`.  
**Expected result:** all tests pass.  
**Failure behavior:** block release; no retry loop beyond one developer correction cycle without root-cause review.
