# Workflow — Diagnose and Fix Cancellation Propagation

## Trigger
Cancellation leaves tools, streams, child processes, or state mutation active.

## Goal
Restore bounded end-to-end cancellation with measurable quiescence.

## Inputs
Reproduction, lifecycle traces, cancellation policy, active-resource inventory, code path.

## Baseline
Record current cancel-to-quiescence p50/p95, active resources at +1s/+5s, late writes, unresolved promises, and leaked descendants over at least 10 controlled runs when feasible.

## Context
Use the smallest code slice that covers runner → adapter → tool/stream/process lifecycle.

## Stages
1. **Observe** — reproduce without modifying behavior.
2. **Measure** — collect baseline using `scripts/cancellation_audit.py` event format.
3. **Diagnose** — run `skills/cancellation-path-audit.md`; identify first boundary where propagation or settlement fails.
4. **Hypothesize** — write one falsifiable cause and expected metric change.
5. **Implement** — propagate signal, make cleanup idempotent, or correct terminal settlement. Avoid unrelated refactors.
6. **Measure again** — repeat the same fixtures and load.
7. **Compare** — require lower/bounded quiescence latency and zero unexplained late mutations.
8. **Verify** — hand implementation and traces to `subagents/lifecycle-verifier.md`.

## Responsible agent
Implementation agent for stages 1–7; independent lifecycle verifier for stage 8.

## Tools
Repository inspection, test runner, safe process inspection, structured event logs, deterministic audit script.

## Outputs
Before/after metrics, boundary matrix, implementation change, verifier decision.

## Checkpoints
- Baseline captured before code changes.
- Ownership proven before forced process cleanup.
- Signal observed inside affected tool path.
- Terminal promise/result settles after cancel.
- No late state mutation after grace period.

## Metrics
p95 cancel-to-quiescence; active resources after 5s; late writes; leaked processes; conformance-path coverage.

## Retry policy
At most 2 implementation retries for the same hypothesis. A third failure requires a new root-cause hypothesis.

## Stop conditions
Stop on verified quiescence or a documented external limitation that cannot be safely bypassed.

## Failure path
Preserve evidence, mark run `blocked`, disable unsafe automatic retry for that execution path, and require owner review.

## Verification
`workflows/regression-verification.md` plus independent verifier.

## Definition of Done
Implemented, measured against baseline, independently verified, no unexplained post-cancel work, and no lifecycle path omitted from tests.
