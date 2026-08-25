# Skill: Stall Investigation

## Purpose
Determine whether a subagent is dead, slow, externally blocked, or still productive using observable events rather than hidden reasoning.

## Trigger
A background agent exceeds the soft silence threshold, a watchdog fires, or retries begin consuming disproportionate tokens.

## Inputs
Timestamped model/tool/protocol/durable-progress events; model/context/effort metadata where available; thresholds; retry history.

## Preconditions
Event timestamps MUST use one clock domain. Human cancellation and policy denial MUST be distinguishable from timeout.

## Allowed tools
Read-only logs, metrics, process/provider status and `scripts/stall_discriminator.py`.

## Constraints
MUST NOT infer liveness from hidden chain-of-thought. MUST NOT kill solely because one wall-clock threshold elapsed. MUST NOT auto-retry irreversible side effects.

## Procedure
1. Capture baseline p50/p95/p99 model response gaps, tool duration, retries, tokens and completion rate.
2. Normalize events into supported signal types.
3. Run the discriminator at the watchdog timestamp.
4. `productive_or_waiting`: suppress stall termination and continue observation.
5. `suspected_stall`: gather another independent signal; do not retry yet.
6. `confirmed_stall`: checkpoint durable progress and classify retry safety.
7. Compare predecessor progress/retry count before retry; stop at `max_retries`.
8. Replay representative traces after any policy change and compare metrics.

## Decision points
Recent tool/protocol/model/durable activity prevents confirmed-stall classification. Human cancel and policy denial are terminal. Confirmed stall plus non-idempotent side effect requires human review.

## Expected output
Classification, evidence timestamps, recovery action, retry count and progress digest.

## Metrics
False-positive watchdog rate, tokens lost per kill, duplicate setup/tool calls, recovery latency and retry convergence.

## Verification
Known healthy-long traces MUST survive the soft boundary; known dead traces MUST eventually reach confirmed stall after the hard boundary.

## Failure handling
Malformed or missing telemetry blocks automatic kill/retry and escalates to conservative host policy.

## Stop conditions
Bounded-retry exhaustion, human cancel, policy denial, unsafe replay, or insufficient evidence.
