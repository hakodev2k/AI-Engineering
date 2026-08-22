# Workflow — Validate Before Side Effects

## Trigger
A tool call is created, resumed after approval/guardrail interruption, restored from session state, or about to cross the side-effect boundary.

## Goal
Preserve lifecycle invariants so one invocation identity cannot execute twice and stale authorization cannot authorize changed arguments.

## Inputs
Lifecycle JSON record, current tool registry, policy, approval, guardrail result, and persisted prior state.

## Baseline
Replay representative happy-path, approval-resume, guardrail-trip, duplicate-call, and interrupted-execution cases. Record duplicate/orphan counts and whether high-impact paths revalidate immediately before execution.

## Stages
1. Observe persisted lifecycle state.
2. Measure baseline invariant failures.
3. Diagnose where identity/approval/output correlation is lost.
4. Form a minimal integration hypothesis.
5. Run `scripts/lifecycle_guard.py` immediately before invocation and after terminal persistence.
6. Reconcile ambiguous execution status instead of blind retry.
7. Measure the same fixtures again.
8. Obtain independent verification from `subagents/lifecycle-verifier.md`.

## Checkpoints
- Stable call ID allocated before approval/side effects.
- Canonical argument hash available.
- Tool is currently enabled/resolved.
- Required guardrail ran after resume.
- Approval matches current call/tool/hash.
- No previous execution marker exists.
- Terminal output/error is correlated after execution.

## Metrics
Duplicate executions, orphan records, stale approvals rejected, resume guardrail coverage, terminal correlation coverage, and manual reconciliation count.

## Retry policy
Validator retries are unnecessary for deterministic state. Recovery from ambiguous execution is allowed once only after external reconciliation supplies new evidence. Never blindly retry a side effect.

## Failure path
Fail closed for high-impact operations, preserve audit-safe lifecycle data, query downstream idempotency/status where available, and escalate unresolved ambiguity.

## Verification
Run `python3 scripts/test_lifecycle_guard.py`; replay streaming and non-streaming integration paths when both exist.

## Definition of Done
Baseline documented; lifecycle invariants implemented; all fixtures pass; duplicate execution is impossible at the local boundary; stale approval blocked; orphan/ambiguous states detected; independent verification complete.
