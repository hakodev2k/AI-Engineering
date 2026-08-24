# Workflow: Measure, Gate, Verify

## Trigger
Suspected idle inference or a new background model-calling worker.

## Goal
Ensure every model request corresponds to fresh work.

## Inputs
Worker telemetry, lifecycle model, request/token metrics.

## Baseline
Capture a representative run before changes: requests/task, cached/input/output tokens, time-to-quiescence, repeated turn/event IDs.

## Stages
1. **Observe** — collect sanitized request and state-transition evidence.
2. **Measure baseline** — run `audit_idle_inference.py` and token aggregation.
3. **Diagnose** — map requests to trigger IDs/state changes.
4. **Hypothesize** — identify missing terminal predicate or stale/replayed trigger.
5. **Implement** — gate inference on fresh trigger + bounded retry.
6. **Measure again** — replay comparable workload.
7. **Improved?** — if idle requests remain, return to diagnosis; maximum 2 cycles.
8. **Verify** — independent Token Verifier runs idle and legitimate-continuation fixtures.

## Responsible agent
Runtime engineer implements; `subagents/token-verifier.md` verifies.

## Tools
Telemetry queries, script, unit/integration tests.

## Outputs
Before/after metrics, root cause, gate decision traces, regression results.

## Checkpoints
Baseline required before optimization. No success claim without comparable post-change measurement.

## Metrics
Idle requests, cached idle tokens, tokens/task, latency/task, time-to-quiescence, false blocks.

## Retry policy
Maximum 2 remediation cycles.

## Stop conditions
Verified metric target, ambiguous lifecycle semantics, or retry exhaustion.

## Failure path
Disable only the offending optional worker if operationally safe and explicitly approved; otherwise block release and escalate. Never drop required user work to save tokens.

## Definition of Done
Evidence captured, root cause identified, admission gate implemented, before/after comparison complete, regression fixtures pass, independent verification complete.