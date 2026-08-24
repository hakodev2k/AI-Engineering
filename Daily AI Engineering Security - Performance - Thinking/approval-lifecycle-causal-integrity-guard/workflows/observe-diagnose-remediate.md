# Workflow — Observe, Diagnose, Remediate

## Trigger
A tool appears slow after approval, an approval interrupt is reported as an error, a rejected action proceeds, or HITL behavior regresses.

## Goal
Restore correct lifecycle semantics before any agent uses the affected telemetry for decisions.

## Inputs
Trace JSONL, runtime build/version, reproducible task, approval decision timings.

## Baseline
Run one immediate-approval case and one controlled delayed-approval case. Capture execution-only and end-to-end durations.

## Stages
1. **Observe** — collect lifecycle events without changing controls.
2. **Measure baseline** — run `python scripts/audit_approval_trace.py <trace>` and record metrics.
3. **Diagnose** — apply `skills/approval-lifecycle-diagnosis.md`.
4. **Form hypothesis** — identify state propagation, timing aggregation, exception flattening, or rejection invalidation defect.
5. **Implement improvement** — change runtime instrumentation/middleware; do not alter approval policy.
6. **Measure again** — repeat immediate/delayed approval cases.
7. **Independent review** — `subagents/causal-reviewer.md` verifies evidence.
8. **Complete** — only after hook and tests pass.

## Responsible agent
Implementation owner for stages 1–6; independent causal reviewer for stage 7.

## Tools
Auditor script, unit/integration tests, trace instrumentation, framework docs.

## Outputs
Before/after metrics, passing audit, verified lifecycle contract.

## Checkpoints
After baseline, after first fix, after independent review.

## Metrics
Invalid transitions, misattribution count, rejected-then-executed count, execution timing coverage.

## Retry policy
Maximum two fix/remeasure iterations. Each retry MUST change the hypothesis or implementation based on new evidence.

## Stop conditions
Success: zero blocking violations and independent verification. Failure: two unsuccessful iterations, missing execution evidence, or any need to weaken approval controls.

## Failure path
Revert speculative changes, preserve trace evidence, escalate to runtime/framework owner.

## Definition of Done
Implemented: lifecycle fields/state propagation changed as required. Measured: controlled traces captured. Verified: auditor/tests pass and independent reviewer accepts the causal conclusion.
