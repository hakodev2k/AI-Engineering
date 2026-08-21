# Hooks

## Pre-Wait Validation Hook
**Trigger:** before entering any wait state.
**Action:** validate target ID/provider, reject sentinel/no-op targets, capture initial state and deadline.
**Command:** `python scripts/wait_broker.py validate --target-id <id> --state-file <state.json> --policy config/wait-policy.json`
**Expected result:** exit 0 with validated target metadata.
**Failure behavior:** do not enter wait; surface explicit validation error.

## Wait Brokerage Hook
**Trigger:** target is non-terminal and parent has no independent work.
**Action:** move waiting into deterministic broker; prefer event source, otherwise adaptive host polling.
**Command:** `python scripts/wait_broker.py wait --target-id <id> --state-file <state.json> --policy config/wait-policy.json --events-out .wait-events.jsonl`
**Expected result:** one wake event only when configured condition fires.
**Failure behavior:** bounded provider retries; then emit `broker_error` and return control.

## Post-Wake Hook
**Trigger:** broker emits wake event.
**Action:** verify target identity, wake reason, terminal/progress semantics, and freshness before model re-entry.
**Expected result:** compact structured event; unchanged state is not a valid wake reason.
**Failure behavior:** reject malformed/stale wake and stop after one validation retry.

## Metrics Hook
**Trigger:** task/turn completion.
**Action:** calculate wait-only turns/tokens, broker polls, wakes, invalid targets, and detection lag.
**Command:** `python scripts/wait_metrics.py trace.jsonl --json-out wait-metrics.json`
**Expected result:** metrics artifact suitable for baseline/regression comparison.
**Failure behavior:** mark performance verification incomplete; do not infer savings.

## Release Gate Hook
**Trigger:** changes to process/subagent/wait orchestration.
**Action:** run tests and compare metrics with approved baseline.
**Commands:** `python -m unittest discover -s tests -v`; then metrics comparison.
**Expected result:** zero missed terminal events, invalid targets fail immediately, wait-only inference reduction meets threshold, detection SLA passes.
**Failure behavior:** block release or rollback policy.