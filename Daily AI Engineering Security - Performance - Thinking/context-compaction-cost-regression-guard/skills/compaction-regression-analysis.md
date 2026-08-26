# Skill: Compaction Regression Analysis

## Purpose
Measure whether a compaction implementation actually reduces context pressure and cost without losing task-critical state.

## Trigger
Any change to compaction code, prompt assembly, tool schemas, model routing, context thresholds, cache policy, or agent metadata.

## Inputs
Normalized pre/post compaction telemetry, representative multi-turn traces, critical context markers, provider usage fields.

## Preconditions
A baseline run exists using the same task fixture, model/provider, tool set, and context configuration.

## Required context
Task goal, baseline metrics, compaction policy, cache semantics, and only the repository/configuration sections necessary to explain differences.

## Allowed tools
Read-only trace inspection, token counters, provider usage logs, `scripts/compaction_regression_guard.py`, unit tests.

## Constraints
- MUST compare against a baseline before claiming improvement.
- MUST preserve critical task context even when token reduction targets are met.
- MUST NOT infer cache hits from latency alone when token usage fields are available.
- MUST NOT weaken security or correctness context to pass token targets.

## Procedure
1. Capture baseline `pre_tokens`, `post_tokens`, cached/uncached input, repeated payload bytes, and turns until the next compaction.
2. Record critical markers that must survive compaction: active goal, unresolved constraints, accepted decisions, and pending verification.
3. Run the same fixture through the candidate implementation.
4. Normalize provider usage fields into the telemetry schema accepted by the guard script.
5. Run the deterministic guard.
6. If the result fails, attribute each reason to request serialization, cache-prefix drift, repeated attachments, threshold accounting, or summary loss.
7. Form one corrective hypothesis and rerun once. A second failure stops automatic iteration.
8. Hand results to the independent verifier.

## Decision points
A candidate fails when uncached input increases beyond policy, post-compaction context remains too large, large payloads are immediately repeated, another compaction occurs too soon, or critical markers are lost.

## Expected output
A before/after metric record plus a machine-readable pass/fail result and identified root cause for any regression.

## Metrics
Tokens/task, uncached-input ratio, cached-input ratio, post/pre token ratio, repeated payload bytes, turns between compactions, retained-marker rate, latency per turn.

## Verification
The verifier reruns tests and checks that baseline and candidate traces use comparable workloads.

## Failure handling
Detection: guard exit code 3 or missing required telemetry. Evidence: retain normalized metrics, not secrets or raw private prompts. Retry policy: one corrective implementation and one rerun. Fallback: restore the previous compaction path. Escalation: provider/runtime ambiguity or critical-marker loss. Stop condition: second failed comparison or any correctness/security regression.
