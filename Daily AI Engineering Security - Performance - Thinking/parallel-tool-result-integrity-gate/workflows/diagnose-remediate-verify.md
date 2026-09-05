# Workflow: Diagnose, Remediate, Verify

## Trigger
Evidence of silent or incorrect parallel tool-result handling.

## Goal
Restore exact tool-call state integrity without sacrificing approval or safety boundaries.

## Inputs
Trace, policy, implementation, deterministic test fixtures.

## Baseline
Record batch size, missing/duplicate/unknown results, retries, calls, tokens, latency, and task outcome on a reproducible case.

## Stages
1. **Observe:** preserve raw call/result/approval events.
2. **Measure:** run the integrity checker and capture baseline metrics.
3. **Diagnose:** localize the first lifecycle stage where cardinality or correlation diverges.
4. **Hypothesize:** document facts, assumptions, evidence, one falsifiable root-cause hypothesis, expected change.
5. **Implement:** fix the smallest responsible state boundary; add explicit overflow handling if needed.
6. **Measure again:** replay the identical workload and fixtures.
7. **Improved?** If no, re-evaluate once with a different evidence-backed hypothesis. Maximum 2 implementation cycles.
8. **Verify:** independent verifier runs regression and approval/resume cases.

## Responsible agent
Investigator/implementer for stages 1-7; Integrity Verifier for stage 8.

## Tools
Trace readers, mocked tool harness, checker, unit/integration tests.

## Outputs
Baseline, root cause, implementation diff, after metrics, verification matrix.

## Checkpoints
Block if a non-idempotent call has uncertain execution state or if approval semantics regress.

## Metrics
Integrity violations; retries; tool calls/task; tokens/task; latency; task completion; unsupported conclusions.

## Retry policy
At most one transport replay when safely idempotent; at most two implementation/hypothesis cycles.

## Stop conditions
Unknown non-idempotent side effect, two failed cycles, missing IDs, or required security downgrade.

## Failure path
Preserve trace, disable affected parallel path or use explicit safe sequential fallback, escalate with evidence.

## Verification
Known-bad fixtures must block before reasoning advances; valid batches must pass; representative runtime trace must have exact terminal accounting.

## Definition of Done
Implemented, measured, verified, and no blocking integrity issue remains.