# Hooks

## Pre-auto-continue guard
**Trigger:** before scheduling an automatic continuation turn.

**Action:** run the trajectory guard over recent events and reject continuation on STOP.

**Command:** `python scripts/trajectory_guard.py <trace.jsonl> --config config/policy.json --json`

**Expected result:** exit 0 permits continuation; exit 2 records WARN but may continue; exit 3 blocks automatic continuation and invokes recovery.

**Failure behavior:** parser/config errors (exit 4) disable auto-continuation for that task and surface an instrumentation failure; do not reset counters.

## Post-tool-result measurement
**Trigger:** immediately after each tool result is normalized and before the next model turn.

**Action:** append action/result fingerprints, emit progress event when deterministic state changed, evaluate sliding window.

**Expected result:** task retains current health state and last durable checkpoint.

**Failure behavior:** preserve raw event reference/id and fail to WARN-only; never fabricate a progress marker.

## Post-compaction continuity hook
**Trigger:** compaction, context optimization, resume, reconnect, or subagent handoff.

**Action:** reload the external trajectory state: last progress marker, counters, recent fingerprints, STOP/WARN state, recovery attempt count.

**Expected result:** compaction does not erase loop evidence.

**Failure behavior:** automatic continuation remains disabled until state is reconstructed or a human/host explicitly resets it with evidence.

## Recovery verification hook
**Trigger:** first action after STOP.

**Action:** compare proposed action fingerprint/recovery key with stopped trajectory; require a materially changed dimension and then wait for a durable progress event.

**Expected result:** either progress is observed and breaker clears, or attempt remains counted.

**Failure behavior:** identical replay is rejected; after configured maximum recovery attempts, task exits blocked/escalated.

## Final verification hook
**Trigger:** task completion.

**Action:** ensure no unresolved STOP, no promised continuation without subsequent action, and final state contains at least one completion/blocker progress marker.

**Expected result:** completion status is evidence-backed.

**Failure behavior:** completion is marked unverified rather than silently accepted.
