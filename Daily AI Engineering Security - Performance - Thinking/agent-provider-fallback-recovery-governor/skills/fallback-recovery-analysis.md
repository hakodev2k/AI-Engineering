# Skill: Fallback Recovery Analysis

## Purpose
Diagnose whether provider failover, cooldown, recovery, and provenance behave correctly during long-running agent execution.

## Trigger
A provider failure activates fallback, a cooldown expires, a long turn crosses a routing checkpoint, or actual provider telemetry diverges from configured intent.

## Inputs
Per-call provider/model, error class/status, fallback reason, monotonic timestamps, cooldown state, route history, retry counts, iteration budget, adapter name, persistent selection.

## Preconditions
Per-call route and error telemetry must be available. Wall-clock timestamps alone should not drive cooldown logic when a monotonic clock is available.

## Procedure
1. Establish baseline: calls/provider, latency, cost, failures, switches, fallback dwell time.
2. Classify failure as transient capacity/rate limit, hard quota, billing/auth, transport, or unknown.
3. Verify fallback chain exists and is wired on the active adapter.
4. Verify temporary runtime route is separate from persistent user-selected route.
5. Calculate primary eligibility from cooldown/retry policy.
6. At each in-loop checkpoint after eligibility, determine whether a bounded primary probe is allowed.
7. On successful probe, restore primary for subsequent calls and record recovery.
8. On failed probe, extend cooldown according to error class without consuming productive iteration budget when policy separates budgets.
9. Detect thrash: repeated primary↔fallback switching beyond policy blocks further probes for the turn.
10. Compare actual provider/model provenance against task/session metadata.

## Decision points
- Transient 429: short cooldown then bounded recheck.
- Hard quota/reset time: respect provider reset/long cooldown; do not probe aggressively.
- Auth/billing invalid: require operator resolution rather than repeated probes.
- Unknown errors: conservative bounded fallback/recheck with explicit telemetry.

## Expected output
Routing-state diagnosis, root cause, measurable baseline, proposed checkpoint/recovery action, and verification plan.

## Metrics
Fallback dwell time, post-cooldown fallback calls, recovery success, switch rate, cost/task, latency/task, provenance mismatch.

## Verification
Simulate one transient 429 followed by primary recovery; primary must resume after eligibility without exceeding switch limits. Simulate persistent outage; fallback must remain stable without thrashing.

## Failure handling
If route provenance or error classification is unavailable, mark recovery verification incomplete rather than guessing.

## Stop conditions
Stop probing after configured failures/switch budget or when the error class indicates hard quota/auth/billing intervention.
