# Hooks

## Pre-refresh validation hook
**Trigger:** before applying any `tools/list` replacement.  
**Action:** record current generation ID/hash, build candidate off-path, compile all schemas, reject incomplete candidate.  
**Command/script:** `python scripts/schema_generation_guard.py validate-catalog --catalog candidate.json`.  
**Expected result:** exit 0 and candidate hash/generation proposal.  
**Failure behavior:** do not mutate active generation; record failure; retry at most policy limit.

## Pre-call pin hook
**Trigger:** immediately before `tools/call`.  
**Action:** acquire active generation lease and capture tool schema hash/validator identity/task metadata.  
**Command/script:** runtime integration; optionally emit JSON event consumed by analyzer.  
**Expected result:** event contains `request_id`, `generation_id`, `tool`, `schema_hash`, `event=dispatch`.  
**Failure behavior:** fail closed if schema-required metadata cannot be pinned.

## Post-response validation hook
**Trigger:** tool response received.  
**Action:** validate with pinned validator, never current global cache; emit validation provenance.  
**Command/script:** runtime integration; audit with `python scripts/schema_generation_guard.py analyze --events trace.jsonl`.  
**Expected result:** no `GENERATION_MISMATCH` or `MISSING_PINNED_VALIDATOR`.  
**Failure behavior:** reject result; do not silently replay side-effecting tool.

## Post-refresh publication hook
**Trigger:** after candidate compilation succeeds.  
**Action:** atomic pointer swap, then record old/new generation IDs and lease counts.  
**Expected result:** readers observe either old complete or new complete generation, never partial state.  
**Failure behavior:** retain old generation and report blocking publication error.

## Final verification hook
**Trigger:** before release/enablement.  
**Action:** run deterministic tests and analyze generated race traces.  
**Command/script:** `python -m unittest tests/test_schema_generation_guard.py -v`.  
**Expected result:** all tests pass; mismatch/bypass counters are zero.  
**Failure behavior:** block release and attach test output.
