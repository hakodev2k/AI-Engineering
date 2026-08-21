# Skill — Manage Compaction Headroom

## Purpose
Keep enough context capacity available to compact or recover a long-running agent session before the session crosses an effective compaction boundary.

## Trigger
Before large tool phases, after major tool outputs, periodically in long sessions, and whenever context utilization enters the warning zone.

## Inputs
Primary context capacity, effective compactor capacity if known, current used tokens/units, expected next-turn growth, compaction reserve, recovery reserve.

## Preconditions
Usage numbers are measured or conservatively estimated. Unknown compactor capacity must not be assumed equal to the primary model capacity.

## Allowed tools
Token counters, provider usage metadata, context telemetry, `scripts/compaction_headroom.py`, handoff/checkpoint writers.

## Constraints
- Never remove correctness-critical context solely to reduce usage.
- Reserve capacity for compaction and recovery before allocating more working context.
- Use conservative capacity when compactor limits are unknown.
- Bound automatic compact/retry cycles.

## Procedure
1. Measure current context usage.
2. Determine effective capacity = minimum of primary capacity and known compactor input capacity.
3. Estimate next-turn/tool growth from recent p95 or configured bound.
4. Reserve compaction and recovery margins.
5. Compute projected utilization after next growth.
6. Classify: `safe`, `warn`, `compact-now`, or `block-growth`.
7. For `compact-now`, create/update a durable handoff then compact once.
8. Re-measure after compaction and verify task-critical state survived.
9. If compaction fails, do not repeat indefinitely; use the durable handoff to start a controlled recovery thread/session.

## Decision points
- Unknown usage → warn and require measurement before a large ingestion.
- Projected usage consumes reserve → compact before adding context.
- Compaction failure with unchanged input → stop retry and recover externally.
- Post-compaction verification fails → restore missing critical state from durable handoff.

## Expected output
Headroom status, projected usage, reserved capacity, required action, verification status.

## Metrics
Compaction success rate, trigger headroom, emergency-clear rate, recovery token cost, task regression rate.

## Verification
Replay recorded usage sequences around thresholds and confirm actions occur before reserve exhaustion.

## Failure handling
One compaction retry only if input materially changed or a transient provider failure is evidenced. Otherwise use fallback recovery.

## Stop conditions
Stop growth when required reserve cannot be maintained; stop retries after the bounded policy; complete only when post-compaction/recovery state is verified.
